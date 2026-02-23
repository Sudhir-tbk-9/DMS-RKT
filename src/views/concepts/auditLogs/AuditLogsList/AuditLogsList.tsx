import React, { useState, useEffect, useMemo } from "react";
import {
  Table,
  Pagination,
  Button,
  Input,
  Select,
  Badge,
  Tooltip,
} from "@/components/ui";
import {
  apiGetAllAuditLogs,
  type AuditLogEntry,
  type AuditLogsResponse,
} from "@/services/AuditAndLogs";
import {
  TbSearch,
  TbFilter,
  TbRefresh,
  TbCheck,
  TbX,
  TbEye,
  TbClock,
  TbUser,
  TbActivity,
  TbDeviceDesktop,
  TbShield,
  TbId,
  TbServer,
  TbGlobe,
  TbBrowser,
  TbCopy,
} from "react-icons/tb";
import { format } from "date-fns";
import Notification from "@/components/ui/Notification";
import toast from "@/components/ui/toast";
import Loading from "@/components/shared/Loading";
import Container from "@/components/shared/Container";

const { Tr, Th, Td, THead, TBody } = Table;

const AuditLogsList = () => {
  // All logs from API
  const [allLogs, setAllLogs] = useState<AuditLogEntry[]>([]);
  // Display logs (filtered and paginated)
  const [displayLogs, setDisplayLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [successFilter, setSuccessFilter] = useState("ALL");
  const [entityTypeFilter, setEntityTypeFilter] = useState("ALL");

  // Detail view state
  const [selectedLog, setSelectedLog] = useState<AuditLogEntry | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const getSelectedOption = (
    options: { value: string; label: string }[],
    value: string,
  ) => options.find((opt) => opt.value === value) || options[0];

  const normalizeValue = (val: any) => {
    if (typeof val === "string") return val;
    if (val && typeof val === "object" && "value" in val) return val.value;
    return "ALL";
  };

  // Get unique categories and entity types from actual data
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(allLogs.map((log) => log.category).filter(Boolean)),
    );
    const categoryOptions = uniqueCategories.sort().map((cat) => ({
      value: cat,
      label: cat,
    }));
    return [{ value: "ALL", label: "All Categories" }, ...categoryOptions];
  }, [allLogs]);

  const entityTypes = useMemo(() => {
    const uniqueEntityTypes = Array.from(
      new Set(allLogs.map((log) => log.entityType).filter(Boolean)),
    );
    const entityOptions = uniqueEntityTypes.sort().map((type) => ({
      value: type,
      label: type,
    }));
    return [{ value: "ALL", label: "All Entity Types" }, ...entityOptions];
  }, [allLogs]);

  const successOptions = [
    { value: "ALL", label: "All Status" },
    { value: "SUCCESS", label: "Success" },
    { value: "FAILED", label: "Failed" },
  ];

  const pageSizeOptions = [
    { value: "5", label: "5 per page" },
    { value: "10", label: "10 per page" },
    { value: "15", label: "15 per page" },
    { value: "20", label: "20 per page" },
    { value: "25", label: "25 per page" },
  ];

  const fetchAllLogs = async () => {
    setLoading(true);
    try {
      // Fetch all logs without pagination from backend
      const response: AuditLogsResponse = await apiGetAllAuditLogs(0, 1000);
      setAllLogs(response.content);
      setTotalElements(response.content.length);
    } catch (error: any) {
      toast.push(
        <Notification type="danger">
          {error?.message || "Failed to load audit logs"}
        </Notification>,
        { placement: "top-center" },
      );
      console.error("Error fetching audit logs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllLogs();
  }, []);

  // Apply filters and pagination whenever filters change
  useEffect(() => {
    // Apply filters
    let filtered = [...allLogs];

    // Search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(
        (log) =>
          log.actorEmail?.toLowerCase().includes(term) ||
          log.action?.toLowerCase().includes(term) ||
          log.requestId?.toLowerCase().includes(term),
      );
    }

    // Category filter
    if (categoryFilter !== "ALL") {
      filtered = filtered.filter((log) => log.category === categoryFilter);
    }

    // Entity type filter
    if (entityTypeFilter !== "ALL") {
      filtered = filtered.filter((log) => log.entityType === entityTypeFilter);
    }

    // Success filter
    if (successFilter !== "ALL") {
      const successValue = successFilter === "SUCCESS";
      filtered = filtered.filter((log) => log.success === successValue);
    }

    // Update totals
    setTotalElements(filtered.length);
    setTotalPages(Math.ceil(filtered.length / pageSize));

    // Apply pagination
    const startIndex = currentPage * pageSize;
    const endIndex = startIndex + pageSize;
    const paginated = filtered.slice(startIndex, endIndex);

    setDisplayLogs(paginated);

    // Reset to first page if current page is out of bounds
    if (currentPage > 0 && paginated.length === 0) {
      setCurrentPage(0);
    }
  }, [
    allLogs,
    searchTerm,
    categoryFilter,
    successFilter,
    entityTypeFilter,
    currentPage,
    pageSize,
  ]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleReset = () => {
    setSearchTerm("");
    setCategoryFilter("ALL");
    setSuccessFilter("ALL");
    setEntityTypeFilter("ALL");
    setPageSize(10);
    setCurrentPage(0);
  };

  const formatDateTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "MMM dd, yyyy HH:mm:ss");
    } catch {
      return dateString;
    }
  };

  const getActionColor = (action: string) => {
    if (
      action.includes("SUCCESS") ||
      action.includes("CREATE") ||
      action.includes("UPDATE")
    ) {
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-100";
    } else if (
      action.includes("FAIL") ||
      action.includes("ERROR") ||
      action.includes("DELETE")
    ) {
      return "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-100";
    } else if (action.includes("LOGIN")) {
      return "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-100";
    }
    return "bg-gray-100 text-gray-700 dark:bg-gray-500/20 dark:text-gray-100";
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "SECURITY":
        return <TbShield className="text-amber-500" />;
      case "USER":
        return <TbUser className="text-blue-500" />;
      case "SYSTEM":
        return <TbDeviceDesktop className="text-purple-500" />;
      default:
        return <TbActivity className="text-gray-500" />;
    }
  };

  const handleViewDetails = (log: AuditLogEntry) => {
    setSelectedLog(log);
    setShowDetails(true);
  };

  const handleCopyToClipboard = async (text: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.push(
        <Notification type="success">
          {fieldName} copied to clipboard!
        </Notification>,
        { placement: "top-center", duration: 2000 },
      );
    } catch (err) {
      toast.push(
        <Notification type="warning">Failed to copy to clipboard</Notification>,
        { placement: "top-center" },
      );
    }
  };

  const DetailView = () => {
    if (!selectedLog) return null;

    const dateInfo = formatDateTime(selectedLog.eventTime);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getCategoryIcon(selectedLog.category)}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Audit Log Details
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  ID: {selectedLog.id}
                </p>
              </div>
            </div>
            <Button
              variant="plain"
              onClick={() => setShowDetails(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ✕
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              {/* Status & Action */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Status
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        {selectedLog.success ? (
                          <TbCheck className="text-emerald-500" />
                        ) : (
                          <TbX className="text-red-500" />
                        )}
                        <span
                          className={`font-medium ${selectedLog.success ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}
                        >
                          {selectedLog.success ? "SUCCESS" : "FAILED"}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Latency
                      </h4>
                      <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-1">
                        {selectedLog.latencyMs}ms
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                    Action
                  </h4>
                  <Badge className={getActionColor(selectedLog.action)}>
                    {selectedLog.action}
                  </Badge>
                </div>
              </div>

              {/* Grid Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  {/* Basic Information */}
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-2">
                      <TbId /> Basic Information
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs text-gray-500 dark:text-gray-400">
                          Request ID
                        </label>
                        <div className="flex items-center justify-between">
                          <p className="font-mono text-sm break-all">
                            {selectedLog.requestId}
                          </p>
                          <Button
                            size="xs"
                            variant="plain"
                            icon={<TbCopy />}
                            onClick={() =>
                              handleCopyToClipboard(
                                selectedLog.requestId,
                                "Request ID",
                              )
                            }
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 dark:text-gray-400">
                          HTTP Method
                        </label>
                        <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-100">
                          {selectedLog.httpMethod}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Actor Information */}
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-2">
                      <TbUser /> Actor Information
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs text-gray-500 dark:text-gray-400">
                          Email
                        </label>
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">
                            {selectedLog.actorEmail}
                          </p>
                          <Button
                            size="xs"
                            variant="plain"
                            icon={<TbCopy />}
                            onClick={() =>
                              handleCopyToClipboard(
                                selectedLog.actorEmail,
                                "Email",
                              )
                            }
                          />
                        </div>
                      </div>
                      {selectedLog.actorId && (
                        <div>
                          <label className="text-xs text-gray-500 dark:text-gray-400">
                            User ID
                          </label>
                          <div className="flex items-center justify-between">
                            <p className="font-mono text-sm">
                              {selectedLog.actorId}
                            </p>
                            <Button
                              size="xs"
                              variant="plain"
                              icon={<TbCopy />}
                              onClick={() =>
                                handleCopyToClipboard(
                                  selectedLog.actorId!.toString(),
                                  "User ID",
                                )
                              }
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  {/* Timing Information */}
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-2">
                      <TbClock /> Timing Information
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs text-gray-500 dark:text-gray-400">
                          Event Time
                        </label>
                        <p className="text-sm font-medium">{dateInfo}</p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 dark:text-gray-400">
                          Category
                        </label>
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(selectedLog.category)}
                          <span className="text-sm">
                            {selectedLog.category}
                          </span>
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 dark:text-gray-400">
                          Entity Type
                        </label>
                        <p className="text-sm font-medium">
                          {selectedLog.entityType}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Network Information */}
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-2">
                      <TbGlobe /> Network Information
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs text-gray-500 dark:text-gray-400">
                          IP Address
                        </label>
                        <div className="flex items-center justify-between">
                          <p className="font-mono text-sm">
                            {selectedLog.ipAddress}
                          </p>
                          <Button
                            size="xs"
                            variant="plain"
                            icon={<TbCopy />}
                            onClick={() =>
                              handleCopyToClipboard(
                                selectedLog.ipAddress,
                                "IP Address",
                              )
                            }
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 dark:text-gray-400">
                          IP Normalized
                        </label>
                        <p className="font-mono text-sm">
                          {selectedLog.ipNormalized}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* User Agent */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-2">
                  <TbBrowser /> User Agent Details
                </h4>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-mono break-words">
                      {selectedLog.userAgent}
                    </p>
                  </div>
                  <Button
                    size="xs"
                    variant="plain"
                    icon={<TbCopy />}
                    onClick={() =>
                      handleCopyToClipboard(selectedLog.userAgent, "User Agent")
                    }
                  />
                </div>
                <div className="mt-3 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    This contains information about the browser, operating
                    system, and device used for this action.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 bg-gray-50 dark:bg-gray-900 flex justify-end">
            <Button
              variant="solid"
              onClick={() => {
                handleCopyToClipboard(
                  JSON.stringify(selectedLog, null, 2),
                  "Full Log Details",
                );
              }}
              className="mr-3"
            >
              Export JSON
            </Button>
            <Button variant="default" onClick={() => setShowDetails(false)}>
              Close
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Container className="p-4">
      <Loading loading={loading}>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Audit Logs
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track and monitor all system activities and security events
          </p>
        </div>

        {/* Filters Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Search bar with reduced width */}
            <div className="w-[48%] md:w-90">
              <Input
                placeholder="Search email, action, or ID..."
                prefix={<TbSearch className="text-lg p-2" />}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(0);
                }}
                onKeyPress={(e) => e.key === "Enter" && e.preventDefault()}
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <Select
                size="md"
                value={getSelectedOption(categories, categoryFilter)}
                onChange={(val) => {
                  setCategoryFilter(normalizeValue(val));
                  setCurrentPage(0);
                }}
                className="min-w-[140px]"
                placeholder="Select category"
                options={categories}
              />

              <Select
                size="md"
                value={getSelectedOption(entityTypes, entityTypeFilter)}
                onChange={(val) => {
                  setEntityTypeFilter(normalizeValue(val));
                  setCurrentPage(0);
                }}
                className="min-w-[140px]"
                placeholder="Select entity type"
                options={entityTypes}
              />

              <Select
                size="md"
                value={getSelectedOption(successOptions, successFilter)}
                onChange={(val) => {
                  setSuccessFilter(normalizeValue(val));
                  setCurrentPage(0);
                }}
                className="min-w-[140px]"
                placeholder="Select status"
                options={successOptions}
              />

              {/* Reset Button */}
              <Button
                variant="plain"
                icon={<TbRefresh />}
                onClick={handleReset}
              >
                Reset
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <TbFilter className="text-lg" />
              <span>
                Showing {displayLogs.length} of {totalElements} logs
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Show:
              </span>
              <Select
                size="md"
                value={getSelectedOption(pageSizeOptions, pageSize.toString())}
                onChange={(val) => {
                  setPageSize(Number(normalizeValue(val)));
                  setCurrentPage(0);
                }}
                className="w-50"
                placeholder="Results per page"
                options={pageSizeOptions}
              />
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {totalElements}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Total Logs
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {displayLogs.filter((log) => log.success).length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Successful Events
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                {displayLogs.filter((log) => !log.success).length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Failed Events
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
              <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                {
                  displayLogs.filter((log) => log.category === "SECURITY")
                    .length
                }
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Security Events
              </div>
            </div>
          </div>
        </div>

        {/* Audit Logs Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          {displayLogs.length > 0 ? (
            <>
              <Table>
                <THead>
                  <Tr>
                    <Th>Timestamp</Th>
                    <Th>Actor</Th>
                    <Th>Action</Th>
                    <Th>Category</Th>
                    <Th>Entity</Th>
                    <Th>IP Address</Th>
                    <Th>Status</Th>
                    <Th>Latency</Th>
                    <Th>Actions</Th>
                  </Tr>
                </THead>
                <TBody>
                  {displayLogs.map((log) => (
                    <Tr key={log.id}>
                      <Td>
                        <div className="flex items-center gap-2">
                          <TbClock className="text-gray-400" />
                          <div>
                            <div className="font-medium">
                              {formatDateTime(log.eventTime)}
                            </div>
                            {/* <div className="text-xs text-gray-500">
                              {log.httpMethod} • {log.requestId.substring(0, 8)}...
                            </div> */}
                          </div>
                        </div>
                      </Td>
                      <Td>
                        <div>
                          <div className="font-medium">{log.actorEmail}</div>
                          {log.actorId && (
                            <div className="text-xs text-gray-500">
                              ID: {log.actorId}
                            </div>
                          )}
                        </div>
                      </Td>
                      <Td>
                        <Badge className={getActionColor(log.action)}>
                          {log.action}
                        </Badge>
                      </Td>
                      <Td>
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(log.category)}
                          <span>{log.category}</span>
                        </div>
                      </Td>
                      <Td>{log.entityType}</Td>
                      <Td>
                        <Tooltip title={log.userAgent}>
                          <div className="cursor-help">
                            <div>{log.ipAddress}</div>
                            <div className="text-xs text-gray-500 truncate max-w-[120px]">
                              {log.userAgent.substring(0, 30)}...
                            </div>
                          </div>
                        </Tooltip>
                      </Td>
                      <Td>
                        {log.success ? (
                          <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                            <TbCheck />
                            <span>Success</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
                            <TbX />
                            <span>Failed</span>
                          </div>
                        )}
                      </Td>
                      <Td>
                        <div className="flex items-center gap-1">
                          <span>{log.latencyMs}ms</span>
                        </div>
                      </Td>
                      <Td>
                        <Button
                          size="xs"
                          variant="plain"
                          icon={<TbEye />}
                          onClick={() => handleViewDetails(log)}
                        >
                          View
                        </Button>
                      </Td>
                    </Tr>
                  ))}
                </TBody>
              </Table>

              {/* Pagination */}
              <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Page {currentPage + 1} of {totalPages} • Total {totalElements}{" "}
                  records
                </div>
                <Pagination
                  currentPage={currentPage}
                  total={totalPages}
                  onChange={handlePageChange}
                  className="justify-end"
                />
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <TbActivity className="text-4xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                No audit logs found
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {searchTerm ||
                categoryFilter !== "ALL" ||
                successFilter !== "ALL" ||
                entityTypeFilter !== "ALL"
                  ? "Try adjusting your filters"
                  : "Audit logs will appear here when available"}
              </p>
            </div>
          )}
        </div>

        {/* Detail View Modal */}
        {showDetails && <DetailView />}
      </Loading>
    </Container>
  );
};

export default AuditLogsList;
