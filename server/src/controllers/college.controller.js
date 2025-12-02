import prisma from '../../db.config.js'

export const getColleges = async (req, res) => {
  try {
    const colleges = await prisma.college.findMany({ select: { id: true, name: true } })
    const formatted = colleges.map(c => ({ id: c.id.toString(), name: c.name }))
    return res.json({ colleges: formatted })
  } catch (err) {
    console.error('Error fetching colleges:', err)
    return res.status(500).json({ error: 'Unable to fetch colleges' })
  }
}

export default { getColleges }

export const createCollege = async (req, res) => {
  try {
    const { name } = req.body
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'College name is required' })
    }
    const trimmed = name.trim()
    const existing = await prisma.college.findFirst({ where: { name: { equals: trimmed } } })
    if (existing) {
      return res.status(409).json({ error: 'College already exists', college: { id: existing.id.toString(), name: existing.name } })
    }
    const newCollege = await prisma.college.create({ data: { name: trimmed, gradingScale: 'FOUR_POINT' } })
    return res.status(201).json({ college: { id: newCollege.id.toString(), name: newCollege.name } })
  } catch (err) {
    console.error('Error creating college:', err)
    return res.status(500).json({ error: 'Unable to create college' })
  }
}
