import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiDownload, FiX, FiFile, FiFileText } from 'react-icons/fi';

function ExportData({ semesters, cgpa, user }) {
  const [isOpen, setIsOpen] = useState(false);
  const [exporting, setExporting] = useState(false);

  const generateCSV = () => {
    setExporting(true);
    
    // Create CSV content
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Header
    csvContent += "CGPA Analyzer - Academic Report\n";
    csvContent += `Student: ${user?.name || 'N/A'}\n`;
    csvContent += `Email: ${user?.email || 'N/A'}\n`;
    csvContent += `Overall CGPA: ${cgpa || 'N/A'}\n`;
    csvContent += `Generated: ${new Date().toLocaleDateString()}\n\n`;
    
    // Data header
    csvContent += "Semester,Subject Name,Credits,Grade,Grade Point,SGPA\n";
    
    // Data rows
    semesters.forEach(sem => {
      if (sem.subjects && sem.subjects.length > 0) {
        sem.subjects.forEach((subject, idx) => {
          csvContent += `${sem.name},"${subject.name}",${subject.credits},${subject.grade},${subject.gradePoint}`;
          if (idx === 0) {
            csvContent += `,${sem.sgpa || 'N/A'}`;
          }
          csvContent += '\n';
        });
      } else {
        csvContent += `${sem.name},No subjects,,,${sem.sgpa || 'N/A'}\n`;
      }
    });
    
    // Total summary
    const totalCredits = semesters.reduce((sum, sem) => 
      sum + (sem.subjects?.reduce((s, sub) => s + sub.credits, 0) || 0), 0
    );
    const totalSubjects = semesters.reduce((sum, sem) => 
      sum + (sem.subjects?.length || 0), 0
    );
    
    csvContent += `\nSummary,,,,\n`;
    csvContent += `Total Semesters,${semesters.length},,,\n`;
    csvContent += `Total Subjects,${totalSubjects},,,\n`;
    csvContent += `Total Credits,${totalCredits},,,\n`;
    csvContent += `Final CGPA,${cgpa || 'N/A'},,,\n`;
    
    // Download
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `academic_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setTimeout(() => {
      setExporting(false);
      setIsOpen(false);
    }, 1000);
  };

  const generatePDF = () => {
    setExporting(true);
    
    // Create a printable HTML page
    const printWindow = window.open('', '_blank');
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Academic Report - ${user?.name || 'Student'}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            padding: 40px;
            max-width: 900px;
            margin: 0 auto;
          }
          .header { 
            border-bottom: 3px solid #000;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .header h1 { 
            font-size: 28px;
            margin-bottom: 10px;
          }
          .header p { 
            color: #666;
            margin: 5px 0;
          }
          .cgpa-box {
            background: #f5f5f5;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            margin: 20px 0;
          }
          .cgpa-box h2 {
            font-size: 48px;
            font-weight: bold;
          }
          .cgpa-box p {
            color: #666;
            margin-top: 5px;
          }
          .semester {
            margin: 30px 0;
            break-inside: avoid;
          }
          .semester-header {
            background: #000;
            color: #fff;
            padding: 12px 16px;
            border-radius: 8px 8px 0 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .semester-header h3 {
            font-size: 18px;
          }
          .sgpa-badge {
            background: #fff;
            color: #000;
            padding: 4px 12px;
            border-radius: 4px;
            font-weight: bold;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
          }
          th {
            background: #f5f5f5;
            font-weight: 600;
          }
          .summary {
            margin-top: 40px;
            padding: 20px;
            background: #f9f9f9;
            border-radius: 8px;
          }
          .summary h3 {
            margin-bottom: 15px;
            font-size: 20px;
          }
          .summary-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
          }
          .summary-item {
            display: flex;
            justify-content: space-between;
            padding: 10px;
            background: white;
            border-radius: 4px;
          }
          .summary-label {
            color: #666;
          }
          .summary-value {
            font-weight: bold;
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            text-align: center;
            color: #666;
            font-size: 12px;
          }
          @media print {
            body { padding: 20px; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Academic Performance Report</h1>
          <p><strong>Student Name:</strong> ${user?.name || 'N/A'}</p>
          <p><strong>Email:</strong> ${user?.email || 'N/A'}</p>
          <p><strong>Report Generated:</strong> ${new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</p>
        </div>

        <div class="cgpa-box">
          <h2>${cgpa || 'N/A'}</h2>
          <p>Overall CGPA</p>
        </div>

        ${semesters.map(sem => `
          <div class="semester">
            <div class="semester-header">
              <h3>${sem.name}</h3>
              <span class="sgpa-badge">SGPA: ${sem.sgpa || 'N/A'}</span>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Subject Name</th>
                  <th>Credits</th>
                  <th>Grade</th>
                  <th>Grade Point</th>
                </tr>
              </thead>
              <tbody>
                ${sem.subjects && sem.subjects.length > 0 
                  ? sem.subjects.map(subject => `
                    <tr>
                      <td>${subject.name}</td>
                      <td>${subject.credits}</td>
                      <td>${subject.grade}</td>
                      <td>${subject.gradePoint}</td>
                    </tr>
                  `).join('')
                  : '<tr><td colspan="4" style="text-align: center; color: #999;">No subjects added</td></tr>'
                }
              </tbody>
            </table>
          </div>
        `).join('')}

        <div class="summary">
          <h3>Summary</h3>
          <div class="summary-grid">
            <div class="summary-item">
              <span class="summary-label">Total Semesters:</span>
              <span class="summary-value">${semesters.length}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Total Credits:</span>
              <span class="summary-value">${semesters.reduce((sum, sem) => 
                sum + (sem.subjects?.reduce((s, sub) => s + sub.credits, 0) || 0), 0
              )}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Total Subjects:</span>
              <span class="summary-value">${semesters.reduce((sum, sem) => 
                sum + (sem.subjects?.length || 0), 0
              )}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Average SGPA:</span>
              <span class="summary-value">${semesters.length > 0 
                ? (semesters.reduce((sum, sem) => sum + (sem.sgpa || 0), 0) / semesters.length).toFixed(2)
                : 'N/A'
              }</span>
            </div>
          </div>
        </div>

        <div class="footer">
          <p>This report was generated by CGPA Analyzer</p>
          <p>© ${new Date().getFullYear()} All rights reserved</p>
        </div>

        <script>
          window.onload = function() {
            window.print();
          }
        </script>
      </body>
      </html>
    `;
    
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    setTimeout(() => {
      setExporting(false);
      setIsOpen(false);
    }, 1000);
  };

  return (
    <>
      {/* Export Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
      >
        <FiDownload className="w-4 h-4" />
        <span>Export Data</span>
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !exporting && setIsOpen(false)}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            >
              {/* Modal Content */}
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden"
              >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                  <h2 className="text-xl font-bold">Export Academic Data</h2>
                  <button
                    onClick={() => !exporting && setIsOpen(false)}
                    disabled={exporting}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  <p className="text-gray-600 mb-6">
                    Download your complete academic records including all semesters, subjects, and grades.
                  </p>

                  {/* Export Options */}
                  <div className="space-y-3">
                    {/* PDF Option */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={generatePDF}
                      disabled={exporting}
                      className="w-full flex items-center gap-4 p-4 border-2 border-gray-200 rounded-xl hover:border-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
                        <FiFile className="w-6 h-6 text-red-600" />
                      </div>
                      <div className="flex-1 text-left">
                        <h3 className="font-semibold">Export as PDF</h3>
                        <p className="text-sm text-gray-600">Printable format with formatted tables</p>
                      </div>
                    </motion.button>

                    {/* CSV Option */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={generateCSV}
                      disabled={exporting}
                      className="w-full flex items-center gap-4 p-4 border-2 border-gray-200 rounded-xl hover:border-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                        <FiFileText className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="flex-1 text-left">
                        <h3 className="font-semibold">Export as CSV</h3>
                        <p className="text-sm text-gray-600">Spreadsheet format for Excel/Sheets</p>
                      </div>
                    </motion.button>
                  </div>

                  {exporting && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center justify-center gap-2 text-sm text-gray-600 mt-4"
                    >
                      <div className="w-4 h-4 border-2 border-gray-300 border-t-black rounded-full animate-spin" />
                      <span>Generating export...</span>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default ExportData;
