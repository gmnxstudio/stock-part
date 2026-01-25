import { getAllItems, getAllStaff } from '@/services/data.service';
import { MobileInputClient } from './MobileInputClient';

export default async function MobileInputPage() {
    const items = await getAllItems();
    const staff = await getAllStaff();

    return (
        <div className="space-y-6 max-w-md mx-auto">
            <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-900">Input Mobile</h1>
                <p className="text-gray-600 mt-1 text-sm">Form cepat untuk perangkat mobile</p>
            </div>

            <MobileInputClient items={items} staff={staff} />
        </div>
    );
}
