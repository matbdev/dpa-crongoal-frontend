import { Toaster } from "react-hot-toast";

export default function CustomToaster() {
    return (
        <Toaster
            position="bottom-right"
            toastOptions={{
                style: {
                    background: 'var(--bg-card)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border-card)',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                },
                success: {
                    iconTheme: {
                        primary: 'var(--color-success)',
                        secondary: 'var(--bg-card)',
                    },
                },
                error: {
                    iconTheme: {
                        primary: 'var(--color-danger)',
                        secondary: 'var(--bg-card)',
                    },
                },
            }}
        />
    )
}