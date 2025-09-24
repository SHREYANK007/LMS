"use client"

import * as React from "react"
import { X } from "lucide-react"
import { Button } from "./button"

interface DialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}

interface DialogContentProps {
  children: React.ReactNode
  className?: string
}

interface DialogHeaderProps {
  children: React.ReactNode
  className?: string
}

interface DialogTitleProps {
  children: React.ReactNode
  className?: string
}

const Dialog: React.FC<DialogProps> = ({ open, onOpenChange, children }) => {
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onOpenChange?.(false)
      }
    }

    if (open) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "unset"
    }
  }, [open, onOpenChange])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => onOpenChange?.(false)}
      />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}

const DialogContent: React.FC<DialogContentProps> = ({ children, className = "" }) => {
  return (
    <div className={`bg-white rounded-lg shadow-xl max-w-md w-full mx-4 ${className}`}>
      {children}
    </div>
  )
}

const DialogHeader: React.FC<DialogHeaderProps> = ({ children, className = "" }) => {
  return (
    <div className={`flex items-center justify-between p-6 pb-4 ${className}`}>
      {children}
    </div>
  )
}

const DialogTitle: React.FC<DialogTitleProps> = ({ children, className = "" }) => {
  return (
    <h2 className={`text-lg font-semibold text-gray-900 ${className}`}>
      {children}
    </h2>
  )
}

const DialogClose: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClose}
      className="p-1 h-auto"
    >
      <X className="h-4 w-4" />
    </Button>
  )
}

export { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose }