import React from "react";

export interface ColumnDef<T> {
  header: string;
  accessor?: (row: T) => React.ReactNode;
  render?: (row: T) => React.ReactNode; // alias if you prefer
  className?: string;
}

export interface TableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  getRowId: (row: T) => string;

  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;

  pageSize: number;
  onPageSizeChange: (size: number) => void;
  pageSizeOptions?: number[];

  emptyText?: string;
  loading?: boolean;
}
