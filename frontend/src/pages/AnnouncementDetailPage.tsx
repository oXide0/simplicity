import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Select, { type MultiValue } from "react-select";
import { ArrowLeft } from "lucide-react";
import { fetchAnnouncement, fetchCategories, createAnnouncement, updateAnnouncement } from "../api";
import type { Category } from "../types";
import { isValidDateFormat, parseDate, isoToFormattedDate } from "../utils/dateFormat";
import styles from "./AnnouncementDetailPage.module.css";

interface CategoryOption {
    value: number;
    label: string;
}

interface FormState {
    title: string;
    body: string;
    publicationDate: string;
    selectedCategories: MultiValue<CategoryOption>;
}

const initialFormState: FormState = {
    title: "",
    body: "",
    publicationDate: "",
    selectedCategories: [],
};

export default function AnnouncementDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = id !== undefined && id !== "new";

    const [form, setForm] = useState<FormState>(initialFormState);
    const [categoryOptions, setCategoryOptions] = useState<CategoryOption[]>([]);
    const [loading, setLoading] = useState(true);

    const updateField = <K extends keyof FormState>(field: K, value: FormState[K]) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    useEffect(() => {
        const load = async () => {
            try {
                const cats = await fetchCategories();
                const options = cats.map((c: Category) => ({
                    value: c.id,
                    label: c.name,
                }));
                setCategoryOptions(options);

                if (isEditMode) {
                    const announcement = await fetchAnnouncement(id);
                    setForm({
                        title: announcement.title,
                        body: announcement.body,
                        publicationDate: isoToFormattedDate(announcement.publicationDate),
                        selectedCategories: announcement.categories.map((c) => ({
                            value: c.id,
                            label: c.name,
                        })),
                    });
                }
            } catch (err) {
                console.error("Failed to load data:", err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id, isEditMode]);

    const handlePublish = async () => {
        const errors: string[] = [];

        if (!form.title.trim()) errors.push("Title is required");
        if (!form.body.trim()) errors.push("Body is required");
        if (!form.publicationDate.trim()) {
            errors.push("Publication date is required");
        } else if (!isValidDateFormat(form.publicationDate)) {
            errors.push("Publication date must be in MM/DD/YYYY HH:mm format");
        }
        if (form.selectedCategories.length === 0) {
            errors.push("At least one category is required");
        }

        if (errors.length > 0) {
            alert(errors.join("\n"));
            return;
        }

        const payload = {
            title: form.title.trim(),
            body: form.body.trim(),
            publicationDate: parseDate(form.publicationDate)!,
            categoryIds: form.selectedCategories.map((c) => c.value),
        };

        try {
            if (isEditMode) {
                await updateAnnouncement(id, payload);
            } else {
                await createAnnouncement(payload);
            }
            navigate("/announcements");
        } catch (err) {
            alert(`Failed to save: ${err instanceof Error ? err.message : "Unknown error"}`);
        }
    };

    if (loading) {
        return <div className={styles.loading}>Loading...</div>;
    }

    return (
        <div className={styles.container}>
            <Link to="/announcements" className={styles.backLink}>
                <ArrowLeft size={16} /> Back to announcements
            </Link>
            <h1 className={styles.title}>{isEditMode ? "Edit Announcement" : "New Announcement"}</h1>

            <div className={styles.card}>
                <div className={styles.field}>
                    <label className={styles.label}>Title</label>
                    <input
                        type="text"
                        className={styles.input}
                        value={form.title}
                        onChange={(e) => updateField("title", e.target.value)}
                        placeholder="Announcement title"
                    />
                </div>

                <div className={styles.field}>
                    <label className={styles.label}>Content</label>
                    <textarea
                        className={styles.textarea}
                        value={form.body}
                        onChange={(e) => updateField("body", e.target.value)}
                        placeholder="Announcement content..."
                    />
                </div>

                <div className={styles.field}>
                    <label className={styles.label}>Categories</label>
                    <Select<CategoryOption, true>
                        isMulti
                        options={categoryOptions}
                        value={form.selectedCategories}
                        onChange={(selected) => updateField("selectedCategories", selected)}
                        placeholder="Select categories..."
                    />
                </div>

                <div className={styles.field}>
                    <label className={styles.label}>Publication Date (MM/DD/YYYY HH:mm)</label>
                    <input
                        type="text"
                        className={styles.input}
                        value={form.publicationDate}
                        onChange={(e) => updateField("publicationDate", e.target.value)}
                        placeholder="MM/DD/YYYY HH:mm"
                    />
                </div>

                <button className={styles.publishBtn} onClick={handlePublish}>
                    {isEditMode ? "Update" : "Publish"}
                </button>
            </div>
        </div>
    );
}
