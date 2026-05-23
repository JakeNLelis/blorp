"use client";

import { useEffect, useState, useRef } from "react";
import { Loader2 } from "lucide-react";

export type AddressData = {
  regionName: string;
  regionCode: string;
  provinceName: string;
  provinceCode: string;
  cityName: string;
  cityCode: string;
  barangayName: string;
  barangayCode: string;
  streetAddress: string;
  contactNumber: string;
};

type PhilippineAddressCascaderProps = {
  onChange: (address: AddressData | null) => void;
  disabled?: boolean;
  initialValues?: Partial<AddressData>;
};

type PSGCItem = {
  code: string;
  name: string;
};

export function PhilippineAddressCascader({
  onChange,
  disabled = false,
  initialValues = {},
}: PhilippineAddressCascaderProps) {
  const [regions, setRegions] = useState<PSGCItem[]>([]);
  const [provinces, setProvinces] = useState<PSGCItem[]>([]);
  const [cities, setCities] = useState<PSGCItem[]>([]);
  const [barangays, setBarangays] = useState<PSGCItem[]>([]);

  const [selectedRegion, setSelectedRegion] = useState(initialValues.regionCode || "");
  const [selectedProvince, setSelectedProvince] = useState(initialValues.provinceCode || "");
  const [selectedCity, setSelectedCity] = useState(initialValues.cityCode || "");
  const [selectedBarangay, setSelectedBarangay] = useState(initialValues.barangayCode || "");
  const [streetAddress, setStreetAddress] = useState(initialValues.streetAddress || "");
  const [contactNumber, setContactNumber] = useState(initialValues.contactNumber || "");

  const [loadingRegions, setLoadingRegions] = useState(false);
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingBarangays, setLoadingBarangays] = useState(false);

  // Fetch all regions on mount
  useEffect(() => {
    async function loadRegions() {
      setLoadingRegions(true);
      try {
        const res = await fetch("https://psgc.gitlab.io/api/regions/");
        const data = await res.json();
        // Sort regions alphabetically
        const sorted = data.sort((a: PSGCItem, b: PSGCItem) => a.name.localeCompare(b.name));
        setRegions(sorted);
      } catch (err) {
        console.error("Failed to load regions:", err);
      } finally {
        setLoadingRegions(false);
      }
    }
    loadRegions();
  }, []);

  // Fetch provinces when region changes
  useEffect(() => {
    if (!selectedRegion) {
      setProvinces([]);
      return;
    }

    async function loadProvinces() {
      setLoadingProvinces(true);
      try {
        const res = await fetch(`https://psgc.gitlab.io/api/regions/${selectedRegion}/provinces/`);
        const data = await res.json();
        
        if (data && data.length > 0) {
          const sorted = data.sort((a: PSGCItem, b: PSGCItem) => a.name.localeCompare(b.name));
          setProvinces(sorted);
        } else {
          // Region has no provinces (e.g. NCR), fallback to empty
          setProvinces([]);
          // Proactively fetch cities/municipalities directly from the region instead
          loadCitiesForNCR();
        }
      } catch (err) {
        console.error("Failed to load provinces:", err);
      } finally {
        setLoadingProvinces(false);
      }
    }

    async function loadCitiesForNCR() {
      setLoadingCities(true);
      try {
        const res = await fetch(`https://psgc.gitlab.io/api/regions/${selectedRegion}/cities-municipalities/`);
        const data = await res.json();
        const sorted = data.sort((a: PSGCItem, b: PSGCItem) => a.name.localeCompare(b.name));
        setCities(sorted);
        setSelectedProvince("NCR_BYPASS"); // Mark province as NCR Bypass
      } catch (err) {
        console.error("Failed to load NCR cities:", err);
      } finally {
        setLoadingCities(false);
      }
    }

    loadProvinces();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRegion]);

  // Fetch cities/municipalities when province changes
  useEffect(() => {
    if (!selectedProvince) {
      setCities([]);
      return;
    }
    if (selectedProvince === "NCR_BYPASS") {
      // Already fetched directly from NCR region
      return;
    }

    async function loadCities() {
      setLoadingCities(true);
      try {
        const res = await fetch(`https://psgc.gitlab.io/api/provinces/${selectedProvince}/cities-municipalities/`);
        const data = await res.json();
        const sorted = data.sort((a: PSGCItem, b: PSGCItem) => a.name.localeCompare(b.name));
        setCities(sorted);
      } catch (err) {
        console.error("Failed to load cities:", err);
      } finally {
        setLoadingCities(false);
      }
    }

    loadCities();
  }, [selectedProvince]);

  // Fetch barangays when city/municipality changes
  useEffect(() => {
    if (!selectedCity) {
      setBarangays([]);
      return;
    }

    async function loadBarangays() {
      setLoadingBarangays(true);
      try {
        const res = await fetch(`https://psgc.gitlab.io/api/cities-municipalities/${selectedCity}/barangays/`);
        const data = await res.json();
        const sorted = data.sort((a: PSGCItem, b: PSGCItem) => a.name.localeCompare(b.name));
        setBarangays(sorted);
      } catch (err) {
        console.error("Failed to load barangays:", err);
      } finally {
        setLoadingBarangays(false);
      }
    }

    loadBarangays();
  }, [selectedCity]);

  // Notify parent component on address modifications
  useEffect(() => {
    const regionObj = regions.find((r) => r.code === selectedRegion);
    const provinceObj = provinces.find((p) => p.code === selectedProvince);
    const cityObj = cities.find((c) => c.code === selectedCity);
    const barangayObj = barangays.find((b) => b.code === selectedBarangay);

    if (selectedRegion && selectedCity && selectedBarangay && streetAddress && contactNumber) {
      onChange({
        regionName: regionObj ? regionObj.name : "",
        regionCode: selectedRegion,
        provinceName: provinceObj ? provinceObj.name : (selectedProvince === "NCR_BYPASS" ? "Metro Manila" : ""),
        provinceCode: selectedProvince,
        cityName: cityObj ? cityObj.name : "",
        cityCode: selectedCity,
        barangayName: barangayObj ? barangayObj.name : "",
        barangayCode: selectedBarangay,
        streetAddress,
        contactNumber,
      });
    } else {
      onChange(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRegion, selectedProvince, selectedCity, selectedBarangay, streetAddress, contactNumber, regions, provinces, cities, barangays]);

  const initialApplied = useRef(false);

  // Handles setting initialValues on load if provided
  useEffect(() => {
    if (initialApplied.current) return;

    let applied = false;
    if (initialValues.regionCode) {
      setSelectedRegion(initialValues.regionCode);
      applied = true;
    }
    if (initialValues.provinceCode) {
      setSelectedProvince(initialValues.provinceCode);
      applied = true;
    }
    if (initialValues.cityCode) {
      setSelectedCity(initialValues.cityCode);
      applied = true;
    }
    if (initialValues.barangayCode) {
      setSelectedBarangay(initialValues.barangayCode);
      applied = true;
    }
    if (initialValues.streetAddress) {
      setStreetAddress(initialValues.streetAddress);
      applied = true;
    }
    if (initialValues.contactNumber) {
      setContactNumber(initialValues.contactNumber);
      applied = true;
    }

    if (applied) {
      initialApplied.current = true;
    }
  }, [initialValues]);

  return (
    <div className="space-y-4 font-sans text-sm">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Contact Number */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Contact Number
          </label>
          <input
            type="text"
            placeholder="e.g. +639171234567"
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
            disabled={disabled}
            required
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        {/* Region */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
            Region
            {loadingRegions && <Loader2 className="size-3 animate-spin text-primary" />}
          </label>
          <select
            value={selectedRegion}
            onChange={(e) => {
              setSelectedRegion(e.target.value);
              setSelectedProvince("");
              setSelectedCity("");
              setSelectedBarangay("");
              setProvinces([]);
              setCities([]);
              setBarangays([]);
            }}
            disabled={disabled || loadingRegions}
            required
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Select Region</option>
            {regions.map((r) => (
              <option key={r.code} value={r.code}>
                {r.name}
              </option>
            ))}
          </select>
        </div>

        {/* Province */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
            Province
            {loadingProvinces && <Loader2 className="size-3 animate-spin text-primary" />}
          </label>
          <select
            value={selectedProvince}
            onChange={(e) => {
              setSelectedProvince(e.target.value);
              setSelectedCity("");
              setSelectedBarangay("");
              setCities([]);
              setBarangays([]);
            }}
            disabled={disabled || loadingProvinces || !selectedRegion || selectedProvince === "NCR_BYPASS"}
            required
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {selectedProvince === "NCR_BYPASS" ? (
              <option value="NCR_BYPASS">Metro Manila (NCR)</option>
            ) : (
              <>
                <option value="">Select Province</option>
                {provinces.map((p) => (
                  <option key={p.code} value={p.code}>
                    {p.name}
                  </option>
                ))}
              </>
            )}
          </select>
        </div>

        {/* City / Municipality */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
            City / Municipality
            {loadingCities && <Loader2 className="size-3 animate-spin text-primary" />}
          </label>
          <select
            value={selectedCity}
            onChange={(e) => {
              setSelectedCity(e.target.value);
              setSelectedBarangay("");
              setBarangays([]);
            }}
            disabled={disabled || loadingCities || !selectedProvince}
            required
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Select City / Municipality</option>
            {cities.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Barangay */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
            Barangay
            {loadingBarangays && <Loader2 className="size-3 animate-spin text-primary" />}
          </label>
          <select
            value={selectedBarangay}
            onChange={(e) => setSelectedBarangay(e.target.value)}
            disabled={disabled || loadingBarangays || !selectedCity}
            required
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Select Barangay</option>
            {barangays.map((b) => (
              <option key={b.code} value={b.code}>
                {b.name}
              </option>
            ))}
          </select>
        </div>

        {/* Street Address */}
        <div className="space-y-2 sm:col-span-2">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Street Address / House Number / Building / Subdivision
          </label>
          <input
            type="text"
            placeholder="e.g. 123 Rizal Ave, Brgy Captain"
            value={streetAddress}
            onChange={(e) => setStreetAddress(e.target.value)}
            disabled={disabled}
            required
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
      </div>
    </div>
  );
}
