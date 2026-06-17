    "use client";

    import { useState } from "react";

    const suratData = Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    title: "SURAT KETERANGAN AKTIF",
    description: "Arsip surat keterangan mahasiswa aktif.",
    arsip: "1288 Arsip",
    color: "#F5F0E8",
    }));

    const FileIcon = () => (
    <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
        d="M9 1H3.5A1.5 1.5 0 0 0 2 2.5v11A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V6L9 1Z"
        stroke="#6B7280"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        />
        <path
        d="M9 1v5h5"
        stroke="#6B7280"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        />
        <path
        d="M5 9h6M5 11.5h4"
        stroke="#6B7280"
        strokeWidth="1.2"
        strokeLinecap="round"
        />
    </svg>
    );

    const ChevronRight = () => (
    <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
        d="M5 3l4 4-4 4"
        stroke="#374151"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        />
    </svg>
    );

    interface SuratCardProps {
    title: string;
    description: string;
    arsip: string;
    color: string;
    }

    function SuratCard({ title, description, arsip, color }: SuratCardProps) {
    const [hovered, setHovered] = useState(false);

    return (
        <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "12px",
            border: `1px solid ${hovered ? "#D1D5DB" : "#E5E7EB"}`,
            padding: "20px",
            cursor: "pointer",
            transition: "all 0.2s ease",
            boxShadow: hovered
            ? "0 4px 16px rgba(0,0,0,0.08)"
            : "0 1px 3px rgba(0,0,0,0.04)",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            transform: hovered ? "translateY(-2px)" : "translateY(0)",
        }}
        >
        {/* Color thumbnail */}
        <div
            style={{
            width: "44px",
            height: "44px",
            borderRadius: "8px",
            backgroundColor: color,
            border: "1px solid #E5E7EB",
            flexShrink: 0,
            }}
        />

        {/* Text content */}
        <div style={{ flex: 1 }}>
            <p
            style={{
                margin: 0,
                fontSize: "11px",
                fontWeight: 700,
                color: "#111827",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                lineHeight: "1.4",
                fontFamily: "'DM Sans', sans-serif",
            }}
            >
            {title}
            </p>
            <p
            style={{
                margin: "4px 0 0",
                fontSize: "11.5px",
                color: "#6B7280",
                lineHeight: "1.5",
                fontFamily: "'DM Sans', sans-serif",
            }}
            >
            {description}
            </p>
        </div>

        {/* Footer */}
        <div
            style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid #F3F4F6",
            paddingTop: "10px",
            }}
        >
            <div
            style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
            }}
            >
            <FileIcon />
            <span
                style={{
                fontSize: "11px",
                color: "#6B7280",
                fontFamily: "'DM Sans', sans-serif",
                }}
            >
                {arsip}
            </span>
            </div>
            <div
            style={{
                width: "24px",
                height: "24px",
                borderRadius: "6px",
                backgroundColor: hovered ? "#F3F4F6" : "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background-color 0.15s ease",
            }}
            >
            <ChevronRight />
            </div>
        </div>
        </div>
    );
    }

    export default function PelayananSuratPage() {
    return (
        <>
        <style>{`
            @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');

            * {
            box-sizing: border-box;
            }

            body {
            margin: 0;
            background-color: #F9FAFB;
            font-family: 'DM Sans', sans-serif;
            }

            .surat-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 14px;
            }

            @media (max-width: 1100px) {
            .surat-grid {
                grid-template-columns: repeat(3, 1fr);
            }
            }

            @media (max-width: 768px) {
            .surat-grid {
                grid-template-columns: repeat(2, 1fr);
            }
            }

            @media (max-width: 480px) {
            .surat-grid {
                grid-template-columns: 1fr;
            }
            }
        `}</style>

        <div
            style={{
            minHeight: "100vh",
            backgroundColor: "#F9FAFB",
            padding: "40px 32px",
            }}
        >
            {/* Header */}
            <div style={{ marginBottom: "28px" }}>
            <h1
                style={{
                margin: 0,
                fontSize: "22px",
                fontWeight: 700,
                color: "#111827",
                fontFamily: "'DM Sans', sans-serif",
                letterSpacing: "-0.01em",
                }}
            >
                Pelayanan Surat
            </h1>
            <p
                style={{
                margin: "4px 0 0",
                fontSize: "13px",
                color: "#9CA3AF",
                fontFamily: "'DM Sans', sans-serif",
                }}
            >
                Silahkan isi formulir dibawah untuk mengajukan surat baru.
            </p>
            </div>

            {/* Grid */}
            <div className="surat-grid ">
            {suratData.map((surat) => (
                <SuratCard
                key={surat.id}
                title={surat.title}
                description={surat.description}
                arsip={surat.arsip}
                color={surat.color}
                />
            ))}
            </div>
        </div>
        </>
    );
    }