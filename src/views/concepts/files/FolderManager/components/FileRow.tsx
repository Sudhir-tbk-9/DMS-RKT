"use client";

import Table from "@/components/ui/Table";
import FileType from "./FileType";
import FileItemDropdown from "./FileItemDropdown";
import fileSizeUnit from "@/utils/fileSizeUnit";
import FileIcon from "@/components/view/FileIcon";
import type { BaseFileItemProps } from "../types";

type FileRowProps = BaseFileItemProps & {
  documentNumber?: string; // Added for consistency with File type
  directoryCode?: string; // Added for consistency with Folder type
};

const { Tr, Td } = Table;

const FileRow = (props: FileRowProps) => {
 
  const {
    id,
    fileType,
    category,
    directoryCode,
    size,
    documentNumber,
    name,
    onClick,
    onPreview,
    ...rest
  } = props;

  const displayId =
    fileType === "directory" ? directoryCode || "N/A" : documentNumber || "N/A";

  return (
    <Tr
      onClick={onClick}
      className={`cursor-pointer hover:bg-gray-50 transition-colors`}
      role="button"
      aria-label={`Open ${name}`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      <Td width="30%">
        <div className="inline-flex items-center gap-2">
          <div className="text-3xl">
            <FileIcon type={fileType || ""} />
          </div>
          <div
            className="font-bold heading-text group-hover:text-primary"
            title={displayId}
          >
            {displayId}
          </div>
        </div>
      </Td>
      <Td>
        <div
          className="heading-text group-hover:text-primary truncate max-w-[200px]"
          title={name}
        >
          {name}
        </div>
      </Td>
      <Td>{fileType !== "directory" ? fileSizeUnit(size || 0) : "-"}</Td>
      {/* <Td>
        <FileType type={fileType || ""} />
      </Td> */}
      <Td>{fileType}</Td>
      {fileType !== "directory" && (
        <Td className="truncate max-w-[150px]" title={category}>
          {category || "-"}
        </Td>
      )}
      <Td onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-end">
          <FileItemDropdown
            id={id}
            {...rest}
            onPreview={fileType !== "directory" ? onPreview : undefined}
          />
        </div>
      </Td>
    </Tr>
  );
};

export default FileRow;
