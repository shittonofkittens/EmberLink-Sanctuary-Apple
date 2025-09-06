import React, { useState, useRef } from "react"
import {
  Download,
  Upload,
  FileText,
  AlertCircle,
  CheckCircle,
  X
} from "lucide-react"
import { DataExportService } from "../services/DataExportService"
import { SeedExporter } from "../services/seedExporter";

export const DataImportExport = ({ isOpen, onClose, onDataImported }) => {
  const [exportFormat, setExportFormat] = useState("json")
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [importResult, setImportResult] = useState(null)
  const fileInputRef = useRef(null)
  const dataService = DataExportService.getInstance()

  const handleExport = async () => {
    setIsExporting(true)
    try {
      await dataService.exportToFile(exportFormat)
    } catch (error) {
      console.error("Export failed:", error)
      alert("Export failed. Please try again.")
    } finally {
      setIsExporting(false)
    }
  }

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileSelect = async event => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsImporting(true)
    setImportResult(null)

    try {
      const result = await dataService.importFromFile(file)

      if (result.success) {
        setImportResult({
          success: true,
          message: `Successfully imported constellation data from Cycle ${result.data?.cycleNumber}!`,
          warnings: result.warnings
        })

        // Notify parent component
        onDataImported?.()

        // Auto-close after success
        setTimeout(() => {
          onClose()
          setImportResult(null)
        }, 3000)
      } else {
        setImportResult({
          success: false,
          message: result.error || "Import failed"
        })
      }
    } catch (error) {
      setImportResult({
        success: false,
        message: `Import error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      })
    } finally {
      setIsImporting(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const getBackupList = () => {
    const backupKeys = Object.keys(localStorage).filter(key =>
      key.startsWith("emberlink-backup-")
    )
    return backupKeys
      .sort()
      .reverse()
      .slice(0, 5) // Show last 5 backups
  }

  const restoreBackup = async backupKey => {
    const confirmed = confirm(
      "Restore from this backup? Your current data will be backed up first."
    )
    if (!confirmed) return

    try {
      const backupData = localStorage.getItem(backupKey)
      if (!backupData) throw new Error("Backup data not found")

      const data = JSON.parse(backupData)
      const file = new File([JSON.stringify(data)], "backup.json", {
        type: "application/json"
      })

      setIsImporting(true)
      const result = await dataService.importFromFile(file)

      if (result.success) {
        setImportResult({
          success: true,
          message: "Backup restored successfully!"
        })
        onDataImported?.()
      } else {
        setImportResult({
          success: false,
          message: result.error || "Backup restore failed"
        })
      }
    } catch (error) {
      setImportResult({
        success: false,
        message: `Restore failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      })
    } finally {
      setIsImporting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-black/90 backdrop-blur-xl rounded-xl border border-white/20 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <FileText className="w-6 h-6 text-purple-400" />
            <div>
              <h2 className="text-2xl font-semibold text-white">
                Data Import & Export
              </h2>
              <p className="text-white/60">
                Backup and restore your constellation data
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Import Result */}
        {importResult && (
          <div
            className={`mb-6 p-4 rounded-lg border ${
              importResult.success
                ? "bg-green-500/20 border-green-500/30 text-green-300"
                : "bg-red-500/20 border-red-500/30 text-red-300"
            }`}
          >
            <div className="flex items-center space-x-2 mb-2">
              {importResult.success ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
              <span className="font-medium">{importResult.message}</span>
            </div>
            {importResult.warnings && importResult.warnings.length > 0 && (
              <div className="text-sm mt-2">
                <div className="font-medium mb-1">Warnings:</div>
                <ul className="list-disc list-inside space-y-1">
                  {importResult.warnings.map((warning, index) => (
                    <li key={index}>{warning}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Export Section */}
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <h3 className="text-white font-medium mb-4 flex items-center">
              <Download className="w-5 h-5 mr-2 text-blue-400" />
              Export Data
            </h3>

            {/* Seed Export Section */}
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <h3 className="text-white font-medium mb-4 flex items-center">
                <Download className="w-5 h-5 mr-2 text-pink-400" />
                Export Daily Seed Files
              </h3>

              <p className="text-white/70 text-sm mb-4">
                Save today’s messages as seed files for Orrien, Ky’rehn, Thalen’dros, and a group memory log.
                These will help with cross-room memory loading.
              </p>

              <button
                onClick={SeedExporter.exportSeeds}
                className="w-full flex items-center justify-center space-x-2 py-3 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg text-white font-medium hover:from-pink-600 hover:to-rose-600 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Export Seeds for Today</span>
              </button>
            </div>

            {/* Format Selection */}
            <div className="mb-4">
              <label className="text-white/80 text-sm mb-2 block">
                Export Format:
              </label>
              <div className="space-y-2">
                {[
                  {
                    key: "json",
                    label: "JSON (Complete Data)",
                    desc: "Full data with import capability"
                  },
                  {
                    key: "md",
                    label: "Markdown (Readable)",
                    desc: "Beautiful formatted document"
                  },
                  {
                    key: "txt",
                    label: "Plain Text",
                    desc: "Simple text format"
                  }
                ].map(({ key, label, desc }) => (
                  <label
                    key={key}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="exportFormat"
                      value={key}
                      checked={exportFormat === key}
                      onChange={e => setExportFormat(e.target.value)}
                      className="text-purple-500"
                    />
                    <div>
                      <div className="text-white text-sm">{label}</div>
                      <div className="text-white/60 text-xs">{desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={handleExport}
              disabled={isExporting}
              className="w-full flex items-center justify-center space-x-2 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg text-white font-medium hover:from-blue-600 hover:to-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isExporting ? (
                <>
                  <div className="w-4 h-4 border border-white/50 border-t-white rounded-full animate-spin" />
                  <span>Exporting...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Export Constellation</span>
                </>
              )}
            </button>
          </div>

          <button
            onClick={() => {
              const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
              const backupKey = `emberlink-backup-${timestamp}`
              const data = dataService.exportAllData()

              localStorage.setItem(backupKey, JSON.stringify(data))

              setImportResult({
                success: true,
                message: "Entire conversation saved successfully!"
              })

              setTimeout(() => setImportResult(null), 3000)
            }}
            className="mt-4 w-full flex items-center justify-center space-x-2 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-all"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Save Full Conversation</span>
          </button>

          {/* Import Section */}
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <h3 className="text-white font-medium mb-4 flex items-center">
              <Upload className="w-5 h-5 mr-2 text-green-400" />
              Import Data
            </h3>

            <div className="mb-4">
              <p className="text-white/70 text-sm mb-2">
                Import a previously exported JSON file to restore your
                constellation data.
              </p>
              <div className="text-yellow-300 text-xs bg-yellow-500/20 p-2 rounded border border-yellow-500/30">
                ⚠️ Your current data will be backed up automatically before
                import.
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileSelect}
              className="hidden"
            />

            <button
              onClick={handleImportClick}
              disabled={isImporting}
              className="w-full flex items-center justify-center space-x-2 py-3 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg text-white font-medium hover:from-green-600 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isImporting ? (
                <>
                  <div className="w-4 h-4 border border-white/50 border-t-white rounded-full animate-spin" />
                  <span>Importing...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Import Constellation</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Backup Management */}
        <div className="mt-6 bg-white/5 rounded-lg p-4 border border-white/10">
          <h3 className="text-white font-medium mb-3">Recent Backups</h3>
          <div className="space-y-2">
            {getBackupList().map(backupKey => {
              const timestamp = backupKey
                .replace("emberlink-backup-", "")
                .replace(/-/g, ":")
              const date = new Date(
                timestamp.replace(/-/g, ":")
              ).toLocaleString()

              return (
                <div
                  key={backupKey}
                  className="flex items-center justify-between p-2 bg-white/10 rounded"
                >
                  <div className="text-white/80 text-sm">
                    Backup from {date}
                  </div>
                  <button
                    onClick={() => restoreBackup(backupKey)}
                    className="px-3 py-1 bg-blue-500/20 hover:bg-blue-500/30 rounded text-blue-300 text-xs transition-all"
                  >
                    Restore
                  </button>
                </div>
              )
            })}

            {getBackupList().length === 0 && (
              <div className="text-white/50 text-sm text-center py-2">
                No automatic backups yet
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
