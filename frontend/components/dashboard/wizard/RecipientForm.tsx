import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface RecipientData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
}

interface RecipientFormProps {
    data: RecipientData;
    onChange: (data: RecipientData) => void;
}

export function RecipientForm({ data, onChange }: RecipientFormProps) {
    const handleChange = (field: keyof RecipientData, value: string) => {
        onChange({ ...data, [field]: value });
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8 py-8">
            <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold">Recipient Details</h3>
                <p className="text-muted-foreground">Enter recipient's contact information below</p>
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label>First Name <span className="text-red-500">*</span></Label>
                    <Input
                        placeholder="Recipient's first name"
                        value={data.firstName}
                        onChange={(e) => handleChange('firstName', e.target.value)}
                        className="h-12"
                    />
                </div>
                <div className="space-y-2">
                    <Label>Last Name <span className="text-red-500">*</span></Label>
                    <Input
                        placeholder="Recipient's last name"
                        value={data.lastName}
                        onChange={(e) => handleChange('lastName', e.target.value)}
                        className="h-12"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label>Email <span className="text-red-500">*</span></Label>
                    <Input
                        placeholder="Recipient's email address"
                        type="email"
                        value={data.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        className="h-12"
                    />
                </div>
                <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input
                        placeholder="Recipient's phone number"
                        value={data.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        className="h-12"
                    />
                </div>
            </div>
        </div>
    );
}
