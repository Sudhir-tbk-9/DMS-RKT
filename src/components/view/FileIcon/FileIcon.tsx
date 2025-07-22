import FileDoc from "@/assets/svg/files/FileDoc";
import FileXls from "@/assets/svg/files/FileXls";
import FilePdf from "@/assets/svg/files/FilePdf";
import FilePpt from "@/assets/svg/files/FilePpt";
import FileFigma from "@/assets/svg/files/FileFigma";
import FileImage from "@/assets/svg/files/FileImage";
import Folder from "@/assets/svg/files/Folder";
import FileTxt from "@/assets/svg/files/Filetxt";
import { FaFileCsv } from "react-icons/fa";
import { PiFileCsv, PiFileCsvBold, PiFileCsvDuotone, PiFileCsvThin } from "react-icons/pi";
import { TbFileTypeCsv } from "react-icons/tb";
import FileDetails from "@/views/concepts/files/FolderManager/components/FolderDetails";

const FileIcon = ({ type, size = 40 }: { type: string; size?: number }) => {
  switch (type) {
    case "pdf":
      return <FilePdf height={size} width={size} />;
    case "xlsx":
      return <FileXls height={size} width={size} />;
    case "txt":
      return <FileTxt height={size} width={size} />;
    case "doc":
      return <FileDoc height={size} width={size} />;
    case "docx":
      return <FileDoc height={size} width={size} />;
    case "ppt":
      return <FilePpt height={size} width={size} />;
    case "figma":
      return <FileFigma height={size} width={size} />;
    case "jpg":
      return <FileImage height={size} width={size} />;
    case "jpeg":
      return <FileImage height={size} width={size} />;
    case "png":
      return <FileImage height={size} width={size} />;
    case "directory":
      return <Folder height={size} width={size} />;
    case "csv":
      return <PiFileCsv height={size} width={size} />;
    default:
      return <></>;
  }
};

export default FileIcon;
