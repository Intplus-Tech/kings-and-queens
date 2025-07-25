"use client"

import { Button } from "@/components/ui/button"

interface GroupTabsProps {
  groups: string[]
  activeGroup: string
  onGroupChange: (group: string) => void
}

export function GroupTabs({ groups, activeGroup, onGroupChange }: GroupTabsProps) {
  return (
    <div className="flex items-center gap-1 mb-2">
      <div className="flex items-center gap-2">
        <span className="text-black text-sm font-bold">🏆</span>
      </div>

      {groups.map((group) => (
        <Button
          key={group}
          variant={activeGroup === group ? "default" : "ghost"}
          size="sm"
          onClick={() => onGroupChange(group)}
          className={`${activeGroup === group
            ? " text-white bg-transparent hover:bg-secondary hover:text-white"
            : "text-muted-foreground hover:bg-secondary hover:text-white"
            }`}
        >
          {activeGroup === group ? (
            <span className="text-white font-bold">Group</span>
          ) : (
            ""
          )}
          {group}
        </Button>
      ))}
    </div>
  )
}
