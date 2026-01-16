import { Suspense } from 'react';
import CreateLead from './CreateLead';

export default function Page() {
    return (
        <Suspense fallback={<div className="p-6 text-center">Loading…</div>}>
            <CreateLead />
        </Suspense>
    );
}
