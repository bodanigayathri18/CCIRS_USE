import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { storage } from '../../services/storage';
import { CivicMap } from '../../components/common/CivicMap';
import { ComplaintPriority } from '../../types';
import { GHMC_WARDS, getClosestGHMCWard } from '../../data/ghmcWards';
import {
  Camera,
  MapPin,
  Upload,
  CheckCircle2,
  AlertCircle,
  Car,
  Trash2,
  Droplets,
  Lightbulb,
  Waves,
  Trees,
  Navigation,
  X,
  FileImage,
  ArrowRight,
  ShieldAlert,
  HelpCircle,
  Search,
} from 'lucide-react';

interface ReportIssuePageProps {
  onNavigate: (view: string) => void;
  onComplaintCreated: (complaintId: string) => void;
}

export const ReportIssuePage: React.FC<ReportIssuePageProps> = ({
  onNavigate,
  onComplaintCreated,
}) => {
  const { currentUser } = useAuth();
  const categories = storage.getCategories();

  // Form states
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || 'cat-roads');
  const [customCategoryName, setCustomCategoryName] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<ComplaintPriority>('Medium');

  // Location states (default centered on Charminar / Hyderabad Central)
  const [latitude, setLatitude] = useState(17.385);
  const [longitude, setLongitude] = useState(78.4867);
  const [address, setAddress] = useState('Tank Bund Road, Near Secretariat, Ward 79');
  const [landmark, setLandmark] = useState('');
  const [wardNumber, setWardNumber] = useState('Ward 79 - Himayatnagar');
  const [accuracyMeters, setAccuracyMeters] = useState<number | undefined>(undefined);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsStatus, setGpsStatus] = useState<string | null>(null);
  const [wardSearch, setWardSearch] = useState('');

  // Image states
  const [images, setImages] = useState<string[]>([]);
  const [fileError, setFileError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [createdComplaintId, setCreatedComplaintId] = useState<string | null>(null);

  // Selected Category Object
  const selectedCategory = categories.find((c) => c.id === categoryId) || categories[0];
  const isOtherCategory = categoryId === 'cat-other';

  // Filtered wards for searchable dropdown
  const filteredWards = GHMC_WARDS.filter(
    (w) =>
      w.wardName.toLowerCase().includes(wardSearch.toLowerCase()) ||
      w.wardNumber.toString().includes(wardSearch) ||
      w.circle.toLowerCase().includes(wardSearch.toLowerCase()) ||
      w.zone.toLowerCase().includes(wardSearch.toLowerCase())
  );

  // Real Geolocation Handler with Accuracy Display
  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      setGpsStatus('Geolocation is not supported by your browser.');
      return;
    }
    setGpsLoading(true);
    setGpsStatus('Acquiring high-precision GPS satellite fix...');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = parseFloat(pos.coords.latitude.toFixed(5));
        const lng = parseFloat(pos.coords.longitude.toFixed(5));
        const acc = Math.round(pos.coords.accuracy);

        setLatitude(lat);
        setLongitude(lng);
        setAccuracyMeters(acc);
        setGpsLoading(false);

        // Auto-match nearest GHMC ward from official coordinates
        const closest = getClosestGHMCWard(lat, lng);
        setWardNumber(`Ward ${closest.wardNumber} - ${closest.wardName}`);
        setAddress(`Near ${closest.wardName} Sector, ${closest.circle}, GHMC`);
        setGpsStatus(`GPS signal locked: ${lat}° N, ${lng}° E (Accuracy: ±${acc}m). Matched Ward ${closest.wardNumber} (${closest.wardName}).`);
      },
      (err) => {
        setGpsLoading(false);
        let msg = 'Could not acquire GPS position.';
        if (err.code === 1) msg = 'Location access denied. Please click on the map to pin your location.';
        else if (err.code === 2) msg = 'Position unavailable. Please use the map or ward selector.';
        else if (err.code === 3) msg = 'GPS acquisition timed out. Please click on the map to drop a pin.';
        setGpsStatus(msg);
      },
      { timeout: 10000, enableHighAccuracy: true, maximumAge: 0 }
    );
  };

  // Map Click Location Select
  const handleMapLocationSelect = (
    lat: number,
    lng: number,
    newAddress: string,
    newWard: string
  ) => {
    setLatitude(lat);
    setLongitude(lng);
    setAddress(newAddress);
    setWardNumber(newWard);
    setAccuracyMeters(5);
    setGpsStatus(`Location pinned on GHMC Map: ${lat}° N, ${lng}° E (${newWard})`);
  };

  // Image Upload Handlers
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError('');
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    // Check 5MB limit per SRS
    if (file.size > 5 * 1024 * 1024) {
      setFileError('File exceeds 5 MB limit. Please select an image under 5 MB.');
      return;
    }
    // Check format
    if (!['image/jpeg', 'image/png', 'image/jpg', 'image/webp'].includes(file.type)) {
      setFileError('Invalid format. Only JPG, JPEG, and PNG images are accepted.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setImages((prev) => [...prev, event.target!.result as string]);
      }
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onNavigate('signin');
      return;
    }

    if (!title.trim()) {
      setFileError('Please provide a descriptive complaint title.');
      return;
    }

    if (isOtherCategory && !customCategoryName.trim()) {
      setFileError('Please specify the issue category name for custom/other issues.');
      return;
    }

    if (!description.trim()) {
      setFileError('Please enter a detailed description of the civic problem.');
      return;
    }

    if (images.length === 0) {
      setFileError('At least one photograph is required as evidence for municipal inspection.');
      return;
    }

    setSubmitting(true);

    try {
      const complaint = storage.createComplaint({
        title: title.trim(),
        description: description.trim(),
        categoryId,
        customCategoryName: isOtherCategory ? customCategoryName.trim() : undefined,
        priority,
        citizen: currentUser,
        location: {
          address,
          latitude,
          longitude,
          landmark: landmark.trim() || undefined,
          wardNumber,
          accuracyMeters,
        },
        images,
      });

      setCreatedComplaintId(complaint.id);
      setSubmitting(false);
    } catch (err) {
      setSubmitting(false);
      setFileError('Failed to submit complaint. Please retry.');
    }
  };

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Car':
        return <Car size={18} />;
      case 'Trash2':
        return <Trash2 size={18} />;
      case 'Droplets':
        return <Droplets size={18} />;
      case 'Lightbulb':
        return <Lightbulb size={18} />;
      case 'Waves':
        return <Waves size={18} />;
      case 'HelpCircle':
        return <HelpCircle size={18} />;
      default:
        return <Trees size={18} />;
    }
  };

  // Success Screen
  if (createdComplaintId) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 px-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-2xl text-center space-y-5 animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle2 size={36} />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
              Grievance Registered in GHMC Portal
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 mt-2">
              Complaint #{createdComplaintId}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {isOtherCategory
                ? `Custom Issue ("${customCategoryName}") submitted for Administrative Department assignment.`
                : `Routed to ${selectedCategory.defaultDepartmentName}.`}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-left space-y-2 text-slate-600">
            <p>
              <strong>Target SLA:</strong> {selectedCategory.slaHours} hours
            </p>
            <p>
              <strong>Assigned Ward:</strong> {wardNumber}
            </p>
            <p>
              <strong>Location:</strong> {address}
            </p>
            {accuracyMeters && (
              <p>
                <strong>GPS Accuracy:</strong> ±{accuracyMeters} meters
              </p>
            )}
            <p>
              <strong>Status:</strong> Assigned to Municipal Inspection Crew
            </p>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <button
              type="button"
              onClick={() => {
                onComplaintCreated(createdComplaintId);
              }}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
            >
              <span>View Complaint &amp; Track Status</span>
              <ArrowRight size={16} />
            </button>

            <button
              type="button"
              onClick={() => {
                setCreatedComplaintId(null);
                setTitle('');
                setDescription('');
                setCustomCategoryName('');
                setImages([]);
              }}
              className="w-full py-2.5 text-slate-600 hover:text-slate-900 text-xs font-semibold rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              Report Another Issue
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
              Form CCIRS-01 · Citizen Grievance
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 mt-2">
              Report a Civic Issue
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Submit photo evidence with GPS tagging for swift GHMC municipal department dispatch.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('citizen-dash')}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 self-start sm:self-center"
          >
            ← Cancel &amp; Back
          </button>
        </div>

        {fileError && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{fileError}</span>
          </div>
        )}

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1: Category Selection */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-600 text-white font-extrabold text-xs flex items-center justify-center">
                  1
                </span>
                <span>Select Civic Problem Category</span>
              </h3>
              <span className="text-xs text-slate-400">Determines Department Routing</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {categories.map((cat) => {
                const isSelected = categoryId === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategoryId(cat.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/70 shadow-xs ring-2 ring-blue-600'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div
                        className="w-8 h-8 rounded-xl text-white flex items-center justify-center shadow-xs"
                        style={{ backgroundColor: cat.color }}
                      >
                        {getCategoryIcon(cat.iconName)}
                      </div>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white text-slate-700 border border-slate-200">
                        {cat.slaHours}h SLA
                      </span>
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 leading-tight">{cat.name}</h4>
                      <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">{cat.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Custom Category Input if "Other" is selected */}
            {isOtherCategory && (
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-2 animate-in fade-in duration-150">
                <label className="block text-xs font-bold text-amber-900 uppercase tracking-wider">
                  Specify Other / Different Civic Issue Name *
                </label>
                <input
                  type="text"
                  value={customCategoryName}
                  onChange={(e) => setCustomCategoryName(e.target.value)}
                  placeholder="e.g. Stray Cattle Hazard, Encroached Footpath, Noise Pollution, Illegal Hoarding..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-amber-300 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
                <p className="text-[11px] text-amber-700">
                  This custom issue will be reviewed by GHMC Administration and assigned to the relevant department with high priority.
                </p>
              </div>
            )}

            {/* Department Routing preview notice */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-center justify-between text-slate-600">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-900">Auto-Routing:</span>
                <span>
                  {isOtherCategory
                    ? 'General Administration & Triage Unit'
                    : selectedCategory.defaultDepartmentName}
                </span>
              </div>
              <span className="text-[11px] font-mono text-blue-700 font-bold">
                Target Resolution: &le; {selectedCategory.slaHours} Hours
              </span>
            </div>
          </div>

          {/* Step 2: Issue Details */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-blue-600 text-white font-extrabold text-xs flex items-center justify-center">
                2
              </span>
              <span>Issue Details &amp; Severity</span>
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Complaint Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Deep crater pothole near Tank Bund Road circle"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Urgency / Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as ComplaintPriority)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="Low">Low — Minor non-obstructive issue</option>
                  <option value="Medium">Medium — Standard routine repair</option>
                  <option value="High">High — Impeding daily traffic/pedestrians</option>
                  <option value="Critical">Critical — Immediate safety/structural hazard</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  GHMC Ward (150 Official Wards)
                </label>
                <div className="space-y-1.5">
                  <input
                    type="text"
                    value={wardSearch}
                    onChange={(e) => setWardSearch(e.target.value)}
                    placeholder="Search ward by name or number..."
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-700 mb-1"
                  />
                  <select
                    value={wardNumber}
                    onChange={(e) => setWardNumber(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    {filteredWards.map((w) => (
                      <option
                        key={w.wardNumber}
                        value={`Ward ${w.wardNumber} - ${w.wardName}`}
                      >
                        Ward {w.wardNumber} - {w.wardName} ({w.circle}, {w.zone})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Detailed Problem Description *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Describe exact spot, physical dimensions, potential hazards, and how long the issue has persisted..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Step 3: Photographic Evidence */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-600 text-white font-extrabold text-xs flex items-center justify-center">
                  3
                </span>
                <span>Photographic Evidence (JPG/PNG &le; 5MB)</span>
              </h3>
              <span className="text-xs text-slate-400">Required for verification</span>
            </div>

            {/* Photo Grid Previews */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {images.map((imgUrl, idx) => (
                <div
                  key={idx}
                  className="relative rounded-2xl overflow-hidden border border-slate-200 h-28 bg-slate-100 group shadow-xs"
                >
                  <img src={imgUrl} alt="Evidence" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removePhoto(idx)}
                    className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center opacity-90 hover:opacity-100 shadow-sm"
                    title="Remove Photo"
                  >
                    <X size={14} />
                  </button>
                  <span className="absolute bottom-1 left-1 bg-slate-950/70 text-white text-[10px] px-1.5 py-0.5 rounded">
                    Photo {idx + 1}
                  </span>
                </div>
              ))}

              {/* Upload Drop Button */}
              <label className="border-2 border-dashed border-slate-300 hover:border-blue-500 hover:bg-blue-50/30 rounded-2xl h-28 flex flex-col items-center justify-center p-3 text-center cursor-pointer transition-colors">
                <Camera size={22} className="text-slate-400 mb-1" />
                <span className="text-[11px] font-semibold text-slate-700">Upload Photo</span>
                <span className="text-[9px] text-slate-400">Max 5MB (JPG, PNG)</span>
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Step 4: Real Location & Interactive Google Map */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-600 text-white font-extrabold text-xs flex items-center justify-center">
                  4
                </span>
                <span>Hyderabad GPS Geolocation &amp; Pin Drop</span>
              </h3>
              <button
                type="button"
                onClick={handleDetectGPS}
                disabled={gpsLoading}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold hover:bg-blue-100 transition-colors shadow-xs"
              >
                <Navigation size={13} className={gpsLoading ? 'animate-spin' : ''} />
                <span>{gpsLoading ? 'Detecting GPS...' : 'Auto-Detect My GPS'}</span>
              </button>
            </div>

            {gpsStatus && (
              <p className="text-xs text-blue-800 font-medium bg-blue-50/80 p-3 rounded-xl border border-blue-100">
                {gpsStatus}
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Street Address / Area *
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Tank Bund Road, Near Secretariat"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Nearby Landmark (Optional)
                </label>
                <input
                  type="text"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  placeholder="e.g. Beside Buddha Statue Gate, Metro Pillar #12"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* GPS Readout and Interactive Map Picker */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
                <span>Latitude: {latitude.toFixed(5)}° N</span>
                <span>Longitude: {longitude.toFixed(5)}° E</span>
                {accuracyMeters && (
                  <span className="text-emerald-600 font-semibold">
                    Accuracy: ±{accuracyMeters}m
                  </span>
                )}
              </div>

              <CivicMap
                selectedLocation={{ latitude, longitude, address }}
                onLocationSelect={handleMapLocationSelect}
                interactive={true}
                height="h-72"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-500">
              By submitting, your grievance is timestamped and logged onto the public municipal portal under the Telangana Citizen Charter.
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white font-bold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
            >
              <span>{submitting ? 'Submitting Grievance...' : 'Submit Civic Complaint'}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
