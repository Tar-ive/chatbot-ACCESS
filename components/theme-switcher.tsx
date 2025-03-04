"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Palette } from "lucide-react"
import { themes, type ThemeName } from "@/lib/themes"

export function ThemeSwitcher({
  onThemeChange,
}: {
  onThemeChange: (theme: ThemeName) => void
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Palette className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {(Object.keys(themes) as ThemeName[]).map((themeName) => (
          <DropdownMenuItem key={themeName} onClick={() => onThemeChange(themeName)}>
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: themes[themeName].customProperties["--primary-color"] }}
              />
              {themeName.charAt(0).toUpperCase() + themeName.slice(1)}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
