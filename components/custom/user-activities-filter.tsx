"use client"

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
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import CustomSelect from "./custom-select";

export interface ActivityFilterState {
  search?: string;
  email?: string;
  email__exact?: string;
  email__icontains?: string;
  api_called?: string;
  api_called__exact?: string;
  api_called__icontains?: string;
  ip_address?: string;
  ip_address__exact?: string;
  ip_address__icontains?: string;
  status?: string;
  device?: string;
  browser?: string;
  ordering?: string;
  activity_time__gte?: string;
  activity_time__lte?: string;
}

interface UserActivitiesFiltersProps {
  filters: ActivityFilterState;
  onFiltersChange: (filters: ActivityFilterState) => void;
  onApplyFilters: () => void;
  onClearFilters: () => void;
}

const filterFields = [
  { key: "email", label: "Email" },
  { key: "api_called", label: "API Called" },
  { key: "ip_address", label: "IP Address" },
  { key: "status", label: "Status" },
  { key: "device", label: "Device" },
  { key: "browser", label: "Browser" },
  { key: "activity_time", label: "Activity Time" },
];

const operatorOptions = [
  { value: "contains", label: "contains" },
  { value: "equals", label: "equals" },
];

const statusOptions = [
  { value: "success", label: "Success" },
  { value: "failed", label: "Failed" },
];

export const UserActivitiesFilters: React.FC<UserActivitiesFiltersProps> = ({
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

  console.log("Filtervalue: ", filterValue);

  const apiList = useSelector((state: RootState) => state.apiList?.data || [])


  const updateFilter = (key: keyof ActivityFilterState, value: string | undefined) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const handleApplyFilter = () => {
    if (!selectedField) return;

    if (selectedField === "activity_time") {
      if (!startDate && !endDate) return;
      
      const updatedFilters = { ...filters };
      
      if (startDate) {
        updatedFilters.activity_time__gte = startDate;
      }
      if (endDate) {
        updatedFilters.activity_time__lte = endDate;
      }
      
      onFiltersChange(updatedFilters);
    } else {
      if (!filterValue) return;

      let filterKey = selectedField;
      if (selectedField !== "status") {
        filterKey =
          selectedOperator === "equals"
            ? `${selectedField}__exact`
            : `${selectedField}__icontains`;
      }

      updateFilter(filterKey as keyof ActivityFilterState, filterValue);
    }

    setSelectedField("");
    setFilterValue("");
    setStartDate("");
    setEndDate("");
    setSelectedOperator("contains");
    setIsPopoverOpen(false);
  };

  const removeFilter = (key: keyof ActivityFilterState | string) => {
    if (key === "activity_time_range") {
      const updatedFilters = { ...filters };
      delete updatedFilters.activity_time__gte;
      delete updatedFilters.activity_time__lte;
      onFiltersChange(updatedFilters);
    } else {
      updateFilter(key as keyof ActivityFilterState, undefined);
    }
    onApplyFilters();
  };

  const getActiveFilters = () => {
    const activeFilters: Array<{
      key: keyof ActivityFilterState;
      label: string;
      value: string;
      isDateRange?: boolean;
    }> = [];

    const hasStartDate = filters.activity_time__gte;
    const hasEndDate = filters.activity_time__lte;
    
    if (hasStartDate && hasEndDate) {
      activeFilters.push({
        key: "activity_time_range" as keyof ActivityFilterState,
        label: "Activity Time",
        value: `${hasStartDate} to ${hasEndDate}`,
        isDateRange: true,
      });
    } else if (hasStartDate) {
      activeFilters.push({
        key: "activity_time__gte",
        label: "Activity Time from",
        value: hasStartDate,
      });
    } else if (hasEndDate) {
      activeFilters.push({
        key: "activity_time__lte",
        label: "Activity Time to",
        value: hasEndDate,
      });
    }

    Object.entries(filters).forEach(([key, value]) => {
      if (key === "search" || !value) return;
      
      if (key === "activity_time__gte" || key === "activity_time__lte") return;

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
        key: key as keyof ActivityFilterState,
        label: `${label}${operatorLabel}`,
        value: value,
      });
    });

    return activeFilters;
  };

  const renderFieldInput = () => {
    console.log("Selected field: ", selectedField);
    if (!selectedField) return null;

    if (selectedField === "status") {
      return (
        <Select value={filterValue} onValueChange={setFilterValue}>
          <SelectTrigger className="bg-background">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent className="bg-background border z-50">
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    if(selectedField === "api_called"){
      return (
        <CustomSelect value={filterValue} onChange={setFilterValue} data={apiList} />
      )
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
    selectedField !== "status" &&
    selectedField !== "activity_time";

  const activeFilters = getActiveFilters();

  const canApplyFilter = () => {
    if (!selectedField) return false;
    if (selectedField === "activity_time") {
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
            placeholder="Search activities..."
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
            placeholder="Search activities..."
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

              {selectedField && selectedField !== "activity_time" && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Value</Label>
                  {renderFieldInput()}
                </div>
              )}

              {selectedField && selectedField === "activity_time" && (
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
                  className="flex-1"
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