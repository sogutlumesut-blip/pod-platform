import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export interface AddressData {
    country: string;
    city: string;
    district: string;
    zipCode: string;
    addressLine1: string;
    addressLine2: string;
}

interface AddressFormProps {
    data: AddressData;
    onChange: (data: AddressData) => void;
}

export function AddressForm({ data, onChange }: AddressFormProps) {
    const handleChange = (field: keyof AddressData, value: string) => {
        onChange({ ...data, [field]: value });
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8 py-8">
            <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold">Shipping Address</h3>
                <p className="text-muted-foreground">Where should we create and ship this order?</p>
            </div>

            <div className="space-y-6">
                <div className="space-y-2">
                    <Label>Country <span className="text-red-500">*</span></Label>
                    <Select value={data.country} onValueChange={(val) => handleChange('country', val)}>
                        <SelectTrigger className="h-12">
                            <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="us">United States</SelectItem>
                            <SelectItem value="uk">United Kingdom</SelectItem>
                            <SelectItem value="de">Germany</SelectItem>
                            <SelectItem value="tr">Turkey</SelectItem>
                            <SelectItem value="fr">France</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>City <span className="text-red-500">*</span></Label>
                        <Input
                            placeholder="City"
                            value={data.city}
                            onChange={(e) => handleChange('city', e.target.value)}
                            className="h-12"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>State / District</Label>
                        <Input
                            placeholder="State or District"
                            value={data.district}
                            onChange={(e) => handleChange('district', e.target.value)}
                            className="h-12"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-1 space-y-2">
                        <Label>Zip Code <span className="text-red-500">*</span></Label>
                        <Input
                            placeholder="Zip"
                            value={data.zipCode}
                            onChange={(e) => handleChange('zipCode', e.target.value)}
                            className="h-12"
                        />
                    </div>
                    <div className="col-span-2 space-y-2">
                        <Label>Address Line 1 <span className="text-red-500">*</span></Label>
                        <Input
                            placeholder="Street address"
                            value={data.addressLine1}
                            onChange={(e) => handleChange('addressLine1', e.target.value)}
                            className="h-12"
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label>Address Line 2 (Optional)</Label>
                    <Input
                        placeholder="Apartment, suite, unit, etc."
                        value={data.addressLine2}
                        onChange={(e) => handleChange('addressLine2', e.target.value)}
                        className="h-12"
                    />
                </div>
            </div>
        </div>
    );
}
