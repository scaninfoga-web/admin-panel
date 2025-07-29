import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Search, X, Plus, ChevronUp, ChevronDown } from "lucide-react";

export interface FilterState {
  search?: string;
  email?: string;
  email__exact?: string;
  email__icontains?: string;
  first_name?: string;
  first_name__exact?: string;
  first_name__icontains?: string;
  last_name?: string;
  last_name__exact?: string;
  last_name__icontains?: string;
  company?: string;
  company__exact?: string;
  company__icontains?: string;
  user_type?: string;
  //   is_active?: string;
  //   is_staff?: string;
  ordering?: string;
  date_joined__gte?: string;
  date_joined__lte?: string;
}

interface SimpleSearchFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onApplyFilters: () => void;
  onClearFilters: () => void;
}

const filterFields = [
  { key: "email", label: "Email" },
  { key: "first_name", label: "First Name" },
  { key: "last_name", label: "Last Name" },
  { key: "company", label: "Company" },
  { key: "user_type", label: "User Type" },
  { key: "date_joined", label: "Created At" },
];

const operatorOptions = [
  { value: "contains", label: "contains" },
  { value: "equals", label: "equals" },
];

const userTypeOptions = [
  { value: "USER", label: "User" },
  { value: "CORPORATE", label: "Corporate" },
  { value: "DEVELOPER", label: "Developer" },
];

const booleanOptions = [
  { value: "true", label: "Yes" },
  { value: "false", label: "No" },
];

export const SimpleSearchFilters: React.FC<SimpleSearchFiltersProps> = ({
  filters,
  onFiltersChange,
  onApplyFilters,
  onClearFilters,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [selectedField, setSelectedField] = useState("");
  const [selectedOperator, setSelectedOperator] = useState("contains");
  const [filterValue, setFilterValue] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const updateFilter = (key: keyof FilterState, value: string | undefined) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const handleApplyFilter = () => {
    if (!selectedField) return;

    if (selectedField === "date_joined") {
      if (!startDate && !endDate) return;
      
      const updatedFilters = { ...filters };
      
      if (startDate) {
        updatedFilters.date_joined__gte = startDate;
      }
      if (endDate) {
        updatedFilters.date_joined__lte = endDate;
      }
      
      // Apply all updates at once
      onFiltersChange(updatedFilters);
    } else {
      // Handle other fields
      if (!filterValue) return;

      let filterKey = selectedField;
      if (
        selectedField !== "user_type" &&
        selectedField !== "is_active" &&
        selectedField !== "is_staff"
      ) {
        filterKey =
          selectedOperator === "equals"
            ? `${selectedField}__exact`
            : `${selectedField}__icontains`;
      }

      updateFilter(filterKey as keyof FilterState, filterValue);
    }

    // Reset form
    setSelectedField("");
    setFilterValue("");
    setStartDate("");
    setEndDate("");
    setSelectedOperator("contains");
    setIsPopoverOpen(false);
    // onApplyFilters();
  };

  const removeFilter = (key: keyof FilterState | string) => {
    // Handle special case for date range removal
    if (key === "date_joined_range") {
      // Remove both date filters
      const updatedFilters = { ...filters };
      delete updatedFilters.date_joined__gte;
      delete updatedFilters.date_joined__lte;
      onFiltersChange(updatedFilters);
    } else {
      updateFilter(key as keyof FilterState, undefined);
    }
    onApplyFilters();
  };

  const getActiveFilters = () => {
    const activeFilters: Array<{
      key: keyof FilterState;
      label: string;
      value: string;
      isDateRange?: boolean;
    }> = [];

    // Handle date range filters specially
    const hasStartDate = filters.date_joined__gte;
    const hasEndDate = filters.date_joined__lte;
    
    if (hasStartDate && hasEndDate) {
      // Show combined date range
      activeFilters.push({
        key: "date_joined_range" as keyof FilterState,
        label: "Created At",
        value: `${hasStartDate} to ${hasEndDate}`,
        isDateRange: true,
      });
    } else if (hasStartDate) {
      activeFilters.push({
        key: "date_joined__gte",
        label: "Created At from",
        value: hasStartDate,
      });
    } else if (hasEndDate) {
      activeFilters.push({
        key: "date_joined__lte",
        label: "Created At to",
        value: hasEndDate,
      });
    }

    Object.entries(filters).forEach(([key, value]) => {
      if (key === "search" || !value) return;
      
      // Skip date fields as they're handled above
      if (key === "date_joined__gte" || key === "date_joined__lte") return;

      let fieldLabel = key;
      let operatorLabel = "";

      if (key.includes("__exact")) {
        fieldLabel = key.replace("__exact", "");
        operatorLabel = " equals";
      } else if (key.includes("__icontains")) {
        fieldLabel = key.replace("__icontains", "");
        operatorLabel = " contains";
      }

      const field = filterFields.find((f) => f.key === fieldLabel);
      const label = field ? field.label : fieldLabel;

      activeFilters.push({
        key: key as keyof FilterState,
        label: `${label}${operatorLabel}`,
        value: value,
      });
    });

    return activeFilters;
  };

  const renderFieldInput = () => {
    if (!selectedField) return null;

    if (selectedField === "user_type") {
      return (
        <Select value={filterValue} onValueChange={setFilterValue}>
          <SelectTrigger className="bg-background">
            <SelectValue placeholder="Select user type" />
          </SelectTrigger>
          <SelectContent className="bg-background border z-50">
            {userTypeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    if (selectedField === "is_active" || selectedField === "is_staff") {
      return (
        <Select value={filterValue} onValueChange={setFilterValue}>
          <SelectTrigger className="bg-background">
            <SelectValue placeholder="Select option" />
          </SelectTrigger>
          <SelectContent className="bg-background border z-50">
            {booleanOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    return (
      <Input
        placeholder="Enter value"
        value={filterValue}
        onChange={(e) => setFilterValue(e.target.value)}
        className="bg-background"
      />
    );
  };

  const showOperatorSelection =
    selectedField &&
    selectedField !== "user_type" &&
    selectedField !== "is_active" &&
    selectedField !== "is_staff" &&
    selectedField !== "date_joined";

  const activeFilters = getActiveFilters();

  // Check if apply button should be enabled
  const canApplyFilter = () => {
    if (!selectedField) return false;
    if (selectedField === "date_joined") {
      return startDate || endDate;
    }
    return !!filterValue;
  };

  if (!isVisible) {
    return (
      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search"
            value={filters.search || ""}
            onChange={(e) => updateFilter("search", e.target.value)}
            className="pl-10"
          />
        </div>

        <Button
          onClick={() => setIsVisible(true)}
          variant="outline"
        >
          FILTER
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4 mb-6">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search"
            value={filters.search || ""}
            onChange={(e) => updateFilter("search", e.target.value)}
            className="pl-10"
          />
        </div>

        <Button
          onClick={() => setIsVisible(false)}
          variant="outline"
        >
          FILTER
          <ChevronUp className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <div className="flex gap-2 items-center">
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-80 p-4 bg-background border z-50"
            align="start"
          >
            <div className="space-y-4">
              <h4 className="font-medium">Add Filter</h4>

              {/* Field Selection */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Field</Label>
                <Select value={selectedField} onValueChange={setSelectedField}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select field" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border z-50">
                    {filterFields.map((field) => (
                      <SelectItem key={field.key} value={field.key}>
                        {field.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {showOperatorSelection && (
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Condition</Label>
                  <RadioGroup
                    value={selectedOperator}
                    onValueChange={setSelectedOperator}
                  >
                    {operatorOptions.map((option) => (
                      <div
                        key={option.value}
                        className="flex items-center space-x-2"
                      >
                        <RadioGroupItem
                          value={option.value}
                          id={option.value}
                        />
                        <Label htmlFor={option.value}>{option.label}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              )}

              {selectedField && selectedField !== "date_joined" && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Value</Label>
                  {renderFieldInput()}
                </div>
              )}

              {selectedField && selectedField === "date_joined" && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Start Date</Label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="bg-background"
                  />
                  <Label className="text-sm font-medium">End Date</Label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="bg-background"
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsPopoverOpen(false);
                    setSelectedField("");
                    setFilterValue("");
                    setStartDate("");
                    setEndDate("");
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleApplyFilter}
                  disabled={!canApplyFilter()}
                  className="flex-1 bg-teal-600 hover:bg-teal-700"
                >
                  Apply Filter
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {activeFilters.map((filter) => (
          <Badge
            key={filter.key}
            variant="secondary"
            className="flex items-center gap-2 px-3 py-1"
          >
            <span className="text-sm">
              {filter.label}: {filter.value}
            </span>
            <X
              className="h-3 w-3 cursor-pointer hover:text-destructive"
              onClick={() => removeFilter(filter.key)}
            />
          </Badge>
        ))}

        {activeFilters.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClearFilters}
            className="h-8"
          >
            Remove all filters
          </Button>
        )}
      </div>
    </div>
  );
};