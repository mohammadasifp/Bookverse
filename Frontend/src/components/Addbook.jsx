import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiBookOpen, FiImage, FiSend, FiUploadCloud } from "react-icons/fi";

const emptyBook = {
  name: "",
  price: "",
  category: "",
  image: null,
  title: "",
  desc: "",
  file: null,
};

const baseFieldClass =
  "peer w-full rounded-2xl border px-4 pb-3 pt-6 text-sm font-semibold shadow-sm outline-none transition placeholder:text-transparent focus:border-indigo-500 focus:shadow-[0_0_0_4px_rgba(99,102,241,0.14)]";

function FloatingField({ label, name, value, onChange, type = "text", placeholder, textarea = false, darkMode = false }) {
  const Input = textarea ? "textarea" : "input";
  const fieldTheme = darkMode
    ? "border-white/10 bg-slate-950/60 text-white focus:bg-slate-950"
    : "border-slate-200/80 bg-white/80 text-slate-900 focus:bg-white";
  const labelTheme = darkMode
    ? "text-slate-400 peer-focus:text-indigo-300"
    : "text-slate-500 peer-focus:text-indigo-600";

  return (
    <label className={textarea ? "relative block md:col-span-2" : "relative block"}>
      <Input
        type={textarea ? undefined : type}
        rows={textarea ? 5 : undefined}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder || label}
        className={`${baseFieldClass} ${fieldTheme} ${textarea ? "min-h-36 resize-none" : ""}`}
      />
      <span className={`pointer-events-none absolute left-4 top-2 text-xs font-bold uppercase tracking-[0.14em] transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:top-2 peer-focus:text-xs peer-focus:font-bold peer-focus:uppercase peer-focus:tracking-[0.14em] ${labelTheme}`}>
        {label}
      </span>
    </label>
  );
}

function UploadBox({ label, name, accept, file, onChange, onDrop, icon: Icon, darkMode = false }) {
  const boxTheme = darkMode
    ? "border-indigo-400/40 bg-white/5 hover:bg-white/10"
    : "border-indigo-300 bg-indigo-50/70 hover:bg-indigo-100/80";
  const iconTheme = darkMode
    ? "bg-slate-950 text-indigo-300"
    : "bg-white text-indigo-600";
  const fileTheme = darkMode
    ? "bg-slate-950 text-indigo-200"
    : "bg-white text-indigo-700";

  return (
    <label
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => onDrop(e, name)}
      className={`group flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed p-6 text-center shadow-sm transition hover:-translate-y-1 hover:border-indigo-500 ${boxTheme}`}
    >
      <input
        type="file"
        name={name}
        accept={accept}
        onChange={onChange}
        className="sr-only"
      />
      <div className={`mb-4 grid h-12 w-12 place-items-center rounded-2xl shadow-lg transition group-hover:scale-110 ${iconTheme}`}>
        <Icon className="h-6 w-6" />
      </div>
      <p className={darkMode ? "text-sm font-black text-white" : "text-sm font-black text-slate-900"}>{label}</p>
      <p className={darkMode ? "mt-2 text-xs font-semibold text-slate-400" : "mt-2 text-xs font-semibold text-slate-500"}>
        Drag and drop or click to upload
      </p>
      <p className={`mt-4 max-w-full truncate rounded-full px-4 py-2 text-xs font-bold shadow-sm ${fileTheme}`}>
        {file?.name || "No file selected"}
      </p>
    </label>
  );
}

function Addbook({ embedded = false, onCreated, darkMode = false }) {
  const navigate = useNavigate();
  const [Data, setData] = useState(emptyBook);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const id = localStorage.getItem("id");
  const token = localStorage.getItem("token");

  const change = (e) => {
    const { name, value, files } = e.target;
    setData((current) => ({ ...current, [name]: files ? files[0] : value }));
  };

  const drop = (e, name) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setData((current) => ({ ...current, [name]: file }));
    }
  };

  const submit = async (e) => {
    e?.preventDefault();

    if (
      !Data.name ||
      !Data.price ||
      !Data.category ||
      !Data.image ||
      !Data.title ||
      !Data.desc ||
      !Data.file
    ) {
      toast.error("All fields are required!");
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("name", Data.name);
      formData.append("price", Data.price);
      formData.append("category", Data.category);
      formData.append("image", Data.image);
      formData.append("title", Data.title);
      formData.append("desc", Data.desc);
      formData.append("file", Data.file);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/books/add-book`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            id: id,
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Book added successfully!");
      onCreated?.(response.data?.book);
      setData(emptyBook);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add book");
    } finally {
      setIsSubmitting(false);
    }
  };

  const form = (
    <form
      onSubmit={submit}
      className={`rounded-[2rem] border p-5 shadow-2xl backdrop-blur-xl transition sm:p-7 ${
        darkMode
          ? "border-white/10 bg-slate-900/75 shadow-black/30"
          : "border-white/70 bg-white/80 shadow-slate-200/80"
      }`}
    >
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-indigo-700 dark:bg-indigo-400/10 dark:text-indigo-200">
            <FiBookOpen className="h-4 w-4" />
            Add Book
          </div>
          <h2 className={darkMode ? "mt-3 text-2xl font-black tracking-normal text-white" : "mt-3 text-2xl font-black tracking-normal text-slate-950"}>
            Publish a new resource
          </h2>
          <p className={darkMode ? "mt-2 text-sm leading-6 text-slate-300" : "mt-2 text-sm leading-6 text-slate-600"}>
            Add the book details, upload its cover, and attach the reading file.
          </p>
        </div>

        {!embedded && (
          <button
            type="button"
            onClick={() => navigate(-1)}
              className={`inline-flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-bold shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-300 hover:text-indigo-700 ${
                darkMode
                  ? "border-white/10 bg-slate-950 text-slate-200"
                  : "border-slate-200 bg-white text-slate-700"
              }`}
          >
            <FiArrowLeft className="h-4 w-4" />
            Back
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <FloatingField label="Book name" name="name" value={Data.name} onChange={change} darkMode={darkMode} />
        <FloatingField label="Price" name="price" value={Data.price} onChange={change} type="number" darkMode={darkMode} />
        <FloatingField label="Category" name="category" value={Data.category} onChange={change} placeholder="Science, Fiction" darkMode={darkMode} />
        <FloatingField label="Title" name="title" value={Data.title} onChange={change} placeholder="Short title" darkMode={darkMode} />

        <UploadBox
          label="Cover Image"
          name="image"
          accept="image/*"
          file={Data.image}
          onChange={change}
          onDrop={drop}
          icon={FiImage}
          darkMode={darkMode}
        />
        <UploadBox
          label="Book File"
          name="file"
          accept=".pdf,.epub"
          file={Data.file}
          onChange={change}
          onDrop={drop}
          icon={FiUploadCloud}
          darkMode={darkMode}
        />

        <FloatingField
          label="Description"
          name="desc"
          value={Data.desc}
          onChange={change}
          placeholder="Brief description"
          textarea
          darkMode={darkMode}
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-7 inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 px-6 py-4 text-sm font-black uppercase tracking-[0.18em] text-white shadow-xl shadow-indigo-500/25 transition hover:-translate-y-1 hover:shadow-indigo-500/40 disabled:cursor-not-allowed disabled:opacity-70"
      >
        <FiSend className="h-5 w-5" />
        {isSubmitting ? "Submitting..." : "Submit Book"}
      </button>
    </form>
  );

  if (embedded) {
    return form;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-cyan-50 p-4 text-slate-950 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 dark:text-white sm:p-8">
      <div className="mx-auto max-w-6xl">{form}</div>
    </div>
  );
}

export default Addbook;
