"use client"

import DashboardLayout from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Plus, Save, Trash } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

interface Standard {
  id: string
  name: string
  description: string
  criteria: string[]
}

const initialStandards: Standard[] = [
  {
    id: "1",
    name: "Hygiene Standards",
    description: "Standards for ensuring proper hygiene in food production",
    criteria: ["Clean production environment", "Staff hygiene protocols followed", "Equipment sanitization procedures"],
  },
  {
    id: "2",
    name: "Packaging Requirements",
    description: "Standards for safe and proper food packaging",
    criteria: [
      "Food-grade packaging materials",
      "Proper sealing to prevent contamination",
      "Appropriate labeling of ingredients",
    ],
  },
  {
    id: "3",
    name: "Expiration Standards",
    description: "Standards for proper expiration dating and shelf life",
    criteria: ["Clear expiration date labeling", "Proper storage instructions", "Shelf life validation testing"],
  },
]

export default function SafetyStandardsPage() {
  const [standards, setStandards] = useState<Standard[]>(initialStandards)
  const [newStandard, setNewStandard] = useState({
    name: "",
    description: "",
    criteria: [""],
  })
  const [isAddingNew, setIsAddingNew] = useState(false)

  const handleAddCriteria = () => {
    setNewStandard({
      ...newStandard,
      criteria: [...newStandard.criteria, ""],
    })
  }

  const handleCriteriaChange = (index: number, value: string) => {
    const updatedCriteria = [...newStandard.criteria]
    updatedCriteria[index] = value
    setNewStandard({
      ...newStandard,
      criteria: updatedCriteria,
    })
  }

  const handleRemoveCriteria = (index: number) => {
    const updatedCriteria = [...newStandard.criteria]
    updatedCriteria.splice(index, 1)
    setNewStandard({
      ...newStandard,
      criteria: updatedCriteria,
    })
  }

  const handleSaveStandard = () => {
    // Filter out empty criteria
    const filteredCriteria = newStandard.criteria.filter((c) => c.trim() !== "")

    if (newStandard.name.trim() === "" || filteredCriteria.length === 0) {
      alert("Please provide a name and at least one criterion")
      return
    }

    const newStandardWithId: Standard = {
      id: Date.now().toString(),
      name: newStandard.name,
      description: newStandard.description,
      criteria: filteredCriteria,
    }

    setStandards([...standards, newStandardWithId])
    setNewStandard({
      name: "",
      description: "",
      criteria: [""],
    })
    setIsAddingNew(false)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Link href="/officer">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Safety Standards</h1>
        </div>

        <div className="flex justify-between items-center">
          <p className="text-gray-500">Define and update food safety standards for verification</p>
          <Button
            className="bg-emerald-600 hover:bg-emerald-700"
            onClick={() => setIsAddingNew(true)}
            disabled={isAddingNew}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Standard
          </Button>
        </div>

        {isAddingNew && (
          <Card>
            <CardHeader>
              <CardTitle>New Safety Standard</CardTitle>
              <CardDescription>Define a new safety standard for product verification</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="standard-name">Standard Name</Label>
                <Input
                  id="standard-name"
                  value={newStandard.name}
                  onChange={(e) => setNewStandard({ ...newStandard, name: e.target.value })}
                  placeholder="e.g., Organic Certification Standards"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="standard-description">Description</Label>
                <Textarea
                  id="standard-description"
                  value={newStandard.description}
                  onChange={(e) => setNewStandard({ ...newStandard, description: e.target.value })}
                  placeholder="Describe the purpose and scope of this standard"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Criteria</Label>
                <p className="text-xs text-gray-500">Add specific criteria that must be met for this standard</p>
                <div className="space-y-3">
                  {newStandard.criteria.map((criterion, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={criterion}
                        onChange={(e) => handleCriteriaChange(index, e.target.value)}
                        placeholder={`Criterion ${index + 1}`}
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleRemoveCriteria(index)}
                        disabled={newStandard.criteria.length <= 1}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={handleAddCriteria} className="mt-2">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Criterion
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setIsAddingNew(false)}>
                Cancel
              </Button>
              <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={handleSaveStandard}>
                <Save className="h-4 w-4 mr-2" />
                Save Standard
              </Button>
            </CardFooter>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {standards.map((standard) => (
            <Card key={standard.id}>
              <CardHeader>
                <CardTitle>{standard.name}</CardTitle>
                <CardDescription>{standard.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <h3 className="text-sm font-medium mb-2">Criteria:</h3>
                <ul className="space-y-1 list-disc pl-5">
                  {standard.criteria.map((criterion, index) => (
                    <li key={index} className="text-sm">
                      {criterion}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
