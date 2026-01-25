// Wrapper component for responsive tables on mobile
import { ReactNode } from 'react';

interface ResponsiveTableProps {
    children: ReactNode;
}

export function ResponsiveTable({ children }: ResponsiveTableProps) {
    return (
        <div className="w-full overflow-x-auto -mx-4 md:mx-0">
            <div className="inline-block min-w-full align-middle">
                <div className="overflow-hidden border rounded-lg md:border-0">
                    {children}
                </div>
            </div>
        </div>
    );
}
