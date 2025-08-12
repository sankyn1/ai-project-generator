import React, { useState } from 'react';
import { Upload, FileText, File } from 'lucide-react';
import toast from 'react-hot-toast';
import * as XLSX from 'xlsx';

const FileUpload = ({ onRequirementsExtracted }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const files = Array.from(e.dataTransfer.files);
        handleFiles(files);
    };

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        handleFiles(files);
    };

    const handleFiles = async (files) => {
        if (files.length === 0) return;

        const file = files[0];
        const allowedTypes = [
            'text/plain',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.ms-excel',
            'text/csv'
        ];

        if (!allowedTypes.includes(file.type)) {
            toast.error('Please upload a text file, Word document, or Excel file');
            return;
        }

        setIsProcessing(true);
        try {
            const requirements = await extractRequirements(file);
            onRequirementsExtracted(requirements);
            toast.success(`Extracted ${requirements.length} requirements from ${file.name}`);
        } catch (error) {
            toast.error('Failed to extract requirements from file');
            console.error('File processing error:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    const extractRequirements = async (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (e) => {
                try {
                    let requirements = [];

                    if (file.type === 'text/plain' || file.type === 'text/csv') {
                        // Handle text files
                        const content = e.target.result;
                        requirements = parseTextContent(content);
                    } else if (file.type.includes('excel') || file.type.includes('spreadsheet')) {
                        // Handle Excel files with XLSX library
                        const data = new Uint8Array(e.target.result);
                        const workbook = XLSX.read(data, { type: 'array' });
                        requirements = parseExcelWorkbook(workbook);
                    } else if (file.type.includes('word')) {
                        // For Word files, show a helpful message
                        toast.info('Word files are not fully supported yet. Please copy and paste the content using the "Paste Text" tab for better results.');
                        const content = e.target.result;
                        requirements = parseTextContent(content);
                    }

                    resolve(requirements.filter(req => req.trim().length > 0));
                } catch (error) {
                    reject(error);
                }
            };

            reader.onerror = () => reject(new Error('Failed to read file'));

            if (file.type === 'text/plain' || file.type === 'text/csv') {
                reader.readAsText(file);
            } else {
                // For binary files (Excel, Word), read as array buffer
                reader.readAsArrayBuffer(file);
            }
        });
    };

    const parseTextContent = (content) => {
        // Split by common delimiters and clean up
        return content
            .split(/[\n\r]+/)
            .map(line => line.trim())
            .filter(line => line.length > 0)
            .filter(line => !line.match(/^[\d\.\-\*\+\s]*$/)) // Remove lines with only numbers/bullets
            .map(line => line.replace(/^[\d\.\-\*\+\s]+/, '').trim()) // Remove leading bullets/numbers
            .filter(line => line.length > 10); // Filter out very short lines
    };

    const parseExcelWorkbook = (workbook) => {
        const requirements = [];

        // Process all sheets
        workbook.SheetNames.forEach(sheetName => {
            const sheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

            jsonData.forEach(row => {
                if (Array.isArray(row)) {
                    row.forEach(cell => {
                        if (cell && typeof cell === 'string') {
                            const cleaned = cell.trim();
                            if (cleaned.length > 10 && !cleaned.match(/^[\d\.\-\*\+\s]*$/)) {
                                requirements.push(cleaned);
                            }
                        }
                    });
                }
            });
        });

        return requirements;
    };

    return (
        <div className="file-upload-section">
            <h3>📁 Upload Requirements File</h3>
            <p>Upload a text file, Word document, or Excel file with your requirements</p>

            <div
                className={`file-upload-area ${isDragging ? 'dragging' : ''} ${isProcessing ? 'processing' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-input').click()}
            >
                <input
                    id="file-input"
                    type="file"
                    accept=".txt,.doc,.docx,.xls,.xlsx,.csv"
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                />

                {isProcessing ? (
                    <div className="upload-processing">
                        <div className="spinner"></div>
                        <p>Processing file...</p>
                    </div>
                ) : (
                    <div className="upload-content">
                        <Upload size={48} />
                        <h4>Drop files here or click to browse</h4>
                        <p>Supported: .txt, .doc, .docx, .xls, .xlsx, .csv</p>
                        <div className="supported-formats">
                            <span><FileText size={16} /> Text</span>
                            <span><File size={16} /> Word</span>
                            <span><File size={16} /> Excel</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FileUpload;