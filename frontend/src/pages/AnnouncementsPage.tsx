import { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useReactTable, getCoreRowModel, createColumnHelper, flexRender } from "@tanstack/react-table";
import Select, { type MultiValue } from "react-select";
import { Pencil, Plus } from "lucide-react";
import { fetchAnnouncements, fetchCategories } from "../api";
import type { Announcement, Category } from "../types";
import { formatDate } from "../utils/dateFormat";
import styles from "./AnnouncementsPage.module.css";

const columnHelper = createColumnHelper<Announcement>();

export default function AnnouncementsPage() {
    const navigate = useNavigate();
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [search, setSearch] = useState("");
    const [selectedCategories, setSelectedCategories] = useState<MultiValue<{ value: number; label: string }>>([]);
    const [loading, setLoading] = useState(true);

    const loadAnnouncements = async () => {
        setLoading(true);
        try {
            const data = await fetchAnnouncements({
                categories: selectedCategories.length > 0 ? selectedCategories.map((c) => c.value) : undefined,
                search: search || undefined,
            });
            setAnnouncements(data);
        } catch (err) {
            console.error("Failed to load announcements:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories().then(setCategories).catch(console.error);
    }, []);

    useEffect(() => {
        const timer = setTimeout(loadAnnouncements, 300);
        return () => clearTimeout(timer);
    }, [search, selectedCategories]);

    const columns = useMemo(
        () => [
            columnHelper.accessor("title", {
                header: "Title",
                cell: (info) => info.getValue(),
            }),
            columnHelper.accessor("publicationDate", {
                header: "Publication date",
                cell: (info) => formatDate(info.getValue()),
            }),
            columnHelper.accessor("updatedAt", {
                header: "Last Update",
                cell: (info) => formatDate(info.getValue()),
            }),
            columnHelper.accessor("categories", {
                header: "Categories",
                cell: (info) =>
                    info.getValue().map((c) => (
                        <span key={c.id} className={styles.categoryBadge}>
                            {c.name}
                        </span>
                    )),
            }),
            columnHelper.display({
                id: "actions",
                header: "",
                cell: ({ row }) => (
                    <Link to={`/announcements/${row.original.id}`} className={styles.editLink}>
                        <Pencil size={18} />
                    </Link>
                ),
            }),
        ],
        [],
    );

    const table = useReactTable({
        data: announcements,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    const categoryOptions = categories.map((c) => ({
        value: c.id,
        label: c.name,
    }));

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Announcements</h1>

            <div className={styles.filters}>
                <input
                    type="text"
                    placeholder="Search by title or body..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className={styles.searchInput}
                />
                <div className={styles.categoryFilter}>
                    <Select
                        isMulti
                        placeholder="Filter by category..."
                        options={categoryOptions}
                        value={selectedCategories}
                        onChange={(selected) => setSelectedCategories(selected)}
                        styles={{
                            control: (base) => ({ ...base, fontSize: 14, borderRadius: 6, minHeight: 38, borderColor: "#ddd" }),
                            valueContainer: (base) => ({ ...base, padding: "2px 12px" }),
                            input: (base) => ({ ...base, margin: 0, padding: 0 }),
                            placeholder: (base) => ({ ...base, fontSize: 14, margin: 0 }),
                        }}
                    />
                </div>
                <button className={styles.newBtn} onClick={() => navigate("/announcements/new")}>
                    <Plus size={18} />
                    <span>New Announcement</span>
                </button>
            </div>

            <div className={styles.tableCard}>
                {loading ? (
                    <div className={styles.loading}>Loading...</div>
                ) : announcements.length === 0 ? (
                    <div className={styles.empty}>No announcements found.</div>
                ) : (
                    <table className={styles.table}>
                        <thead>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <th key={header.id}>
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody>
                            {table.getRowModel().rows.map((row) => (
                                <tr key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <td key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
