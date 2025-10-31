import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import prisma from '../../db.config.js'
import bcrypt from 'bcrypt'

const saltRounds = 12

export default function setupGooglePassport() {
  const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
  const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
  const CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/api/auth/google/callback'

  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    console.warn('Google OAuth not configured (GOOGLE_CLIENT_ID/SECRET missing)')
    return
  }

  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile?.emails?.[0]?.value?.toLowerCase();
          const displayName = profile?.displayName || email?.split('@')?.[0] || 'user'
          if (!email) return done(new Error('No email available from Google'))

          // Ensure there is a default college to attach OAuth users to
          let defaultCollege = await prisma.college.findFirst({ where: { name: 'Default College' } })
          if (!defaultCollege) {
            defaultCollege = await prisma.college.create({ data: { name: 'Default College', gradingScale: 'FOUR_POINT' } })
          }

          // Find or create user
          let user = await prisma.user.findFirst({ where: { email } })
          if (!user) {
            // make a unique username from email/displayName
            let base = displayName.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || email.split('@')[0]
            let username = base
            let i = 1
            while (await prisma.user.findFirst({ where: { username } })) {
              username = `${base}${i++}`
            }

            // generate a random password hash so the field is satisfied
            const randomPass = Math.random().toString(36).slice(2)
            const hashed = await bcrypt.hash(randomPass, saltRounds)

            user = await prisma.user.create({
              data: {
                username,
                email,
                password: hashed,
                collegeId: defaultCollege.id,
              },
            })
          }

          // return a minimal user object for downstream handlers
          return done(null, { username: user.username, email: user.email })
        } catch (err) {
          return done(err)
        }
      }
    )
  )
}
