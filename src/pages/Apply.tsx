import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, ArrowRight, Check, Briefcase, MapPin, Clock, Phone,
  Mail, MessageSquare, Shield, Loader2, CheckCircle2, Calendar,
  User, GraduationCap, Building2, DollarSign, Star, Users, MessageCircle, XCircle
} from "lucide-react";
import { MpesaService } from "@/lib/mpesa";
import { toast } from "sonner";
import posCashier from "@/assets/pos-cashier.jpg";
import posCleaner from "@/assets/pos-cleaner.jpg";
import posStorekeeper from "@/assets/pos-storekeeper.jpg";
import posDriver from "@/assets/pos-driver.jpg";
import posLoader from "@/assets/pos-loader.jpg";
import posMarketer from "@/assets/pos-marketer.jpg";
import posSales from "@/assets/pos-sales.jpg";
import posChef from "@/assets/pos-chef.jpg";
import posWarehouse from "@/assets/pos-warehouse.jpg";
import posGuard from "@/assets/pos-guard.jpg";
import quickmartImg from "@/assets/supermarkets/quickmart.jpg";
import naivasImg from "@/assets/supermarkets/naivas.jpg";
import carrefourImg from "@/assets/supermarkets/carrefour.webp";
import cleanshelfImg from "@/assets/cleanshelf-brand.jpg";
import mpesaLogo from "@/assets/mpesa-logo.png";

const supermarketData: Record<string, { name: string; color: string; lightBg: string; gradient: string; image: string; processingFee: number }> = {
  quickmart: { name: "Quickmart", color: "#E53935", lightBg: "#FFF5F5", gradient: "from-red-50 to-rose-50", image: quickmartImg, processingFee: 160 },
  naivas: { name: "Naivas", color: "#4CAF50", lightBg: "#F0FFF4", gradient: "from-green-50 to-emerald-50", image: naivasImg, processingFee: 140 },
  carrefour: { name: "Carrefour", color: "#1565C0", lightBg: "#EFF6FF", gradient: "from-blue-50 to-indigo-50", image: carrefourImg, processingFee: 150 },
  cleanshelf: { name: "Cleanshelf", color: "#43A047", lightBg: "#F0FFF4", gradient: "from-green-50 to-teal-50", image: cleanshelfImg, processingFee: 139 },
};

const positionImages: Record<string, string> = {
  "Cleaners": posCleaner,
  "Cashiers": posCashier,
  "Store Keepers": posStorekeeper,
  "Drivers": posDriver,
  "Loaders & Off-loaders": posLoader,
  "Marketer": posMarketer,
  "Sales Attendant": posSales,
  "Chef": posChef,
  "Warehouse Supervisor": posWarehouse,
  "Guards": posGuard,
};

const positions = [
  "Cleaners", "Cashiers", "Store Keepers", "Drivers", "Loaders & Off-loaders",
  "Marketer", "Sales Attendant", "Chef", "Warehouse Supervisor", "Guards",
];

const jobData: Record<string, { category: string; salary: string; benefit: string; benefitAmount: string }> = {
  "Cleaners": { category: "Maintenance", salary: "25,000", benefit: "Transport Allowance", benefitAmount: "3,000" },
  "Cashiers": { category: "Customer Service", salary: "34,000", benefit: "Medical Allowance", benefitAmount: "3,000" },
  "Store Keepers": { category: "Inventory", salary: "38,000", benefit: "Housing Allowance", benefitAmount: "5,000" },
  "Drivers": { category: "Logistics", salary: "45,000", benefit: "Fuel Allowance", benefitAmount: "8,000" },
  "Loaders & Off-loaders": { category: "Warehouse", salary: "28,000", benefit: "Transport Allowance", benefitAmount: "3,000" },
  "Marketer": { category: "Sales", salary: "35,000", benefit: "Commission", benefitAmount: "5%" },
  "Sales Attendant": { category: "Retail", salary: "30,000", benefit: "Sales Bonus", benefitAmount: "2,000" },
  "Chef": { category: "Kitchen", salary: "50,000", benefit: "Meal Allowance", benefitAmount: "4,000" },
  "Warehouse Supervisor": { category: "Management", salary: "55,000", benefit: "Leadership Bonus", benefitAmount: "8,000" },
  "Guards": { category: "Security", salary: "32,000", benefit: "Night Allowance", benefitAmount: "3,500" },
};

const workTypes = ["Full Time", "Part Time"];
const interviewModes = ["Physical", "Online"];
const employmentTypes = ["Permanent", "Contract"];
const salaryRanges = ["15k–30k", "30k–50k", "50k–80k", "80k–120k", "120k+"];
const educationLevels = ["Primary", "Secondary", "College", "University"];
const experienceLevels = ["0–1 years", "1–5 years", "5–10 years", "10+ years"];
const startTimes = ["Immediately", "Within 2 weeks", "Within 1 month", "More than 1 month"];
const contactMethods = [
  { id: "call", label: "Call", icon: Phone },
  { id: "sms", label: "SMS", icon: MessageSquare },
  { id: "email", label: "Email", icon: Mail },
];

const generateDates = () => {
  const dates: Date[] = [];
  const now = new Date();
  for (let i = 1; dates.length < 10; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    if (d.getDay() !== 0 && d.getDay() !== 6) dates.push(d);
  }
  return dates;
};

const timeSlots = ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"];

const Chip = ({ label, selected, onClick, color }: { label: string; selected: boolean; onClick: () => void; color: string }) => (
  <button
    type="button"
    onClick={onClick}
    className="px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 border cursor-pointer"
    style={{
      backgroundColor: selected ? color : "white",
      borderColor: selected ? color : "#E5E7EB",
      color: selected ? "white" : "#6B7280",
      boxShadow: selected ? `0 4px 14px ${color}30` : "none",
    }}
  >
    {label}
  </button>
);

const ProgressBar = ({ current, total, color }: { current: number; total: number; color: string }) => (
  <div className="mb-8">
    <div className="flex items-center justify-between mb-3">
      <span className="text-sm font-medium text-muted-foreground">Step {current + 1} of {total}</span>
      <span className="text-sm font-semibold" style={{ color }}>{Math.round(((current + 1) / total) * 100)}% Complete</span>
    </div>
    <div className="h-2 rounded-full bg-muted overflow-hidden">
      <motion.div
        className="h-full rounded-full"
        style={{ backgroundColor: color }}
        initial={{ width: 0 }}
        animate={{ width: `${((current + 1) / total) * 100}%` }}
        transition={{ duration: 0.5 }}
      />
    </div>
  </div>
);

const stepIcons = [Briefcase, User, GraduationCap, CheckCircle2];
const stepLabels = ["Select Position", "Personal Info", "Your Preferences", "Review & Submit"];

const Apply = () => {
  const { supermarket } = useParams<{ supermarket: string }>();
  const navigate = useNavigate();
  const brand = supermarketData[supermarket || ""] || supermarketData.quickmart;

  const [step, setStep] = useState(0);
  const [selectedPosition, setSelectedPosition] = useState("");
  const [workType, setWorkType] = useState("");
  const [interviewMode, setInterviewMode] = useState("");
  const [employmentType, setEmploymentType] = useState("");
  const [salary, setSalary] = useState("");
  const [education, setEducation] = useState("");
  const [experience, setExperience] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [startTime, setStartTime] = useState("");
  const [willingToTrain, setWillingToTrain] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [contactMethod, setContactMethod] = useState("");
  const [contactValue, setContactValue] = useState("");
  const [mpesaNumber, setMpesaNumber] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'completed' | 'failed'>('idle');
  const [checkoutRequestId, setCheckoutRequestId] = useState<string>("");
  const [isPolling, setIsPolling] = useState(false);

  const [processingStage, setProcessingStage] = useState(0);
  const processingStages = [
    { label: "Checking application...", icon: Loader2 },
    { label: "Reviewing qualifications...", icon: GraduationCap },
    { label: "Searching vacancies...", icon: Building2 },
    { label: "Matching positions...", icon: Star },
  ];

  const dates = generateDates();

  const runProcessing = useCallback(() => {
    setProcessingStage(0);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      if (i >= processingStages.length) {
        clearInterval(interval);
        setTimeout(() => setStep(4), 800);
      } else {
        setProcessingStage(i);
      }
    }, 1200);
  }, []);

  useEffect(() => {
    if (step === 3) runProcessing();
  }, [step, runProcessing]);

  const canProceed = () => {
    switch (step) {
      case 0: return !!selectedPosition;
      case 1: return !!(fullName && phone && location && startTime && willingToTrain);
      case 2: return !!(workType && interviewMode && employmentType && salary && education && experience);
      case 5: return !!(selectedDate && selectedTime && contactMethod && contactValue);
      case 6: return mpesaNumber.length >= 10;
      default: return true;
    }
  };

  const nextStep = async () => {
    if (!canProceed()) return;

    // Handle payment on step 6
    if (step === 6) {
      await handlePayment();
      return;
    }

    setStep((s) => s + 1);
    setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 50);
  };

  // Handle M-Pesa payment
  const handlePayment = async () => {
    if (!mpesaNumber || paymentStatus === 'processing') return;

    setPaymentStatus('processing');

    // Generate application ID
    const applicationId = `APP${Date.now()}`;

    const result = await MpesaService.initiateSTKPush(
      mpesaNumber,
      brand.processingFee,
      applicationId,
      'anonymous', // User ID - replace with actual auth
      brand.name
    );

    if (result.success && result.checkoutRequestId) {
      setCheckoutRequestId(result.checkoutRequestId);
      setIsPolling(true);

      // Start polling for payment status
      pollPaymentStatus(result.checkoutRequestId);
    } else {
      setPaymentStatus('failed');
      toast.error(result.error || 'Payment failed');
    }
  };

  // Poll payment status
  const pollPaymentStatus = async (checkoutId: string) => {
    let attempts = 0;
    const maxAttempts = 30;

    const checkStatus = async () => {
      if (attempts >= maxAttempts) {
        setPaymentStatus('failed');
        setIsPolling(false);
        toast.error('Payment confirmation timeout');
        return;
      }
      attempts++;

      try {
        // Check payment status from callback data
        const response = await fetch(`/api/payhero/status?checkout_request_id=${checkoutId}`);
        const data = await response.json();

        if (data?.status === 'completed') {
          setPaymentStatus('completed');
          setIsPolling(false);
          toast.success('Payment successful!');
          // Move to success step
          setStep(7);
          setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 50);
          return;
        }

        if (data?.status === 'failed') {
          setPaymentStatus('failed');
          setIsPolling(false);
          toast.error('Payment failed');
          return;
        }

        // Continue polling
        setTimeout(checkStatus, 5000);
      } catch (error) {
        // Continue polling on error
        setTimeout(checkStatus, 5000);
      }
    };

    setTimeout(checkStatus, 5000);
  };

  const formatDate = (d: Date) => d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

  const pageVariants = {
    initial: { opacity: 0, x: 60 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -60 },
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: brand.lightBg }}>
      {/* Branded Header */}
      <div className="sticky top-0 z-50 border-b bg-white/90 backdrop-blur-xl" style={{ borderColor: brand.color + "20" }}>
        <div className="container flex items-center h-16 gap-4">
          <button onClick={() => step > 0 && step < 3 ? setStep(step - 1) : navigate("/")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            {step > 0 && step < 3 ? "Back" : "Home"}
          </button>
          <div className="flex items-center gap-2 ml-auto">
            <div className="h-8 w-8 rounded-lg flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: brand.color }}>
              {brand.name[0]}
            </div>
            <span className="font-bold text-foreground">{brand.name}</span>
          </div>
        </div>
        {/* Brand color bar */}
        <div className="h-1" style={{ backgroundColor: brand.color }} />
      </div>

      <div className="container max-w-2xl py-8 px-4">
        {(step === 0 || step === 1 || step === 2 || step === 5 || step === 6) && (
          <>
            <p className="text-sm text-muted-foreground mb-4">Complete your application in 4 simple steps</p>
            <ProgressBar current={step} total={4} color={brand.color} />
            {/* Step indicators */}
            <div className="flex items-center justify-between mb-8">
              {stepLabels.map((label, i) => {
                const Icon = stepIcons[i];
                const isActive = i <= step;
                return (
                  <div key={label} className="flex flex-col items-center gap-1.5 flex-1">
                    <div
                      className="h-10 w-10 rounded-full flex items-center justify-center transition-all"
                      style={{
                        backgroundColor: isActive ? brand.color + "15" : "#F3F4F6",
                        border: `2px solid ${isActive ? brand.color : "#E5E7EB"}`,
                      }}
                    >
                      <Icon className="h-4 w-4" style={{ color: isActive ? brand.color : "#9CA3AF" }} />
                    </div>
                    <span className="text-[10px] font-medium text-center leading-tight" style={{ color: isActive ? brand.color : "#9CA3AF" }}>{label}</span>
                  </div>
                );
              })}
            </div>
          </>
        )}

        <AnimatePresence mode="wait">
          {/* STEP 0: Select Position */}
          {step === 0 && (
            <motion.div key="s0" {...pageVariants} transition={{ duration: 0.4 }}>
              <div className="text-center mb-8">
                <div className="mx-auto w-full max-w-md h-40 sm:h-48 rounded-2xl overflow-hidden mb-4 border-2 shadow-lg" style={{ borderColor: brand.color }}>
                  <img src={brand.image} alt={brand.name} className="w-full h-full object-cover" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Select Position</h2>
                <p className="text-gray-500">What role are you looking for at {brand.name}?</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {positions.map((pos) => {
                  const job = jobData[pos];
                  return (
                    <div
                      key={pos}
                      className="relative rounded-2xl border overflow-hidden bg-white transition-all duration-300 hover:shadow-lg"
                      style={{ borderColor: "#E5E7EB" }}
                    >
                      <div className="h-32 overflow-hidden">
                        <img src={positionImages[pos]} alt={pos} className="w-full h-full object-cover" loading="lazy" width={400} height={200} />
                      </div>
                      <div className="p-4">
                        <span 
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-white mb-3"
                          style={{ backgroundColor: brand.color }}
                        >
                          <Briefcase className="h-3 w-3" />
                          {job.category}
                        </span>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">{pos}</h3>
                        <div className="flex items-center gap-1.5 text-gray-900 mb-2">
                          <span className="text-red-600 font-bold text-lg">Ksh. {job.salary}</span>
                          <span className="text-sm text-gray-500">per month</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-600 text-sm mb-5">
                          <Shield className="h-4 w-4 text-gray-500" />
                          <span>{job.benefit}: <span className="font-medium text-gray-800">Ksh. {job.benefitAmount}</span></span>
                        </div>
                        <button
                          onClick={() => { setSelectedPosition(pos); setStep(1); setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 50); }}
                          className="w-full flex items-center justify-center gap-2 rounded-xl px-4 py-3.5 font-semibold text-white text-sm transition-all hover:scale-[1.02] hover:shadow-lg cursor-pointer"
                          style={{ backgroundColor: brand.color }}
                        >
                          Apply Now
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* STEP 1: Personal Info */}
          {step === 1 && (
            <motion.div key="s1" {...pageVariants} transition={{ duration: 0.4 }}>
              <div className="text-center mb-8">
                <div className="mx-auto w-full max-w-md h-40 sm:h-48 rounded-2xl overflow-hidden mb-4 border-2 shadow-lg" style={{ borderColor: brand.color }}>
                  <img src={brand.image} alt={brand.name} className="w-full h-full object-cover" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Personal Information</h2>
                <p className="text-gray-500">Your contact details and availability</p>
              </div>
              <div className="space-y-5 bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                {[
                  { label: "Full Name", value: fullName, set: setFullName, icon: User, placeholder: "Enter your full name", required: true },
                  { label: "Email Address", value: email, set: setEmail, icon: Mail, placeholder: "your.email@example.com", required: false },
                  { label: "Phone Number", value: phone, set: setPhone, icon: Phone, placeholder: "0712 345 678", required: true },
                  { label: "Where do you live?", value: location, set: setLocation, icon: MapPin, placeholder: "Nairobi, Westlands", required: true },
                ].map((field) => (
                  <div key={field.label}>
                    <label className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-1.5 block">
                      <field.icon className="h-4 w-4" style={{ color: brand.color }} />
                      {field.label} {field.required && <span style={{ color: brand.color }}>*</span>}
                    </label>
                    <input
                      value={field.value}
                      onChange={(e) => field.set(e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full rounded-xl border-2 bg-white px-4 py-3.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none transition-all"
                      style={{
                        borderColor: field.value ? brand.color : "#E5E7EB",
                        boxShadow: field.value ? `0 0 0 3px ${brand.color}10` : "none",
                      }}
                      onFocus={(e) => { e.target.style.borderColor = brand.color; e.target.style.boxShadow = `0 0 0 3px ${brand.color}15`; }}
                      onBlur={(e) => { if (!field.value) { e.target.style.borderColor = "#E5E7EB"; e.target.style.boxShadow = "none"; } }}
                    />
                  </div>
                ))}
                <div>
                  <label className="text-sm font-semibold text-gray-800 mb-2 block">When can you start?</label>
                  <select
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full rounded-xl border-2 bg-white px-4 py-3 text-sm text-gray-900 focus:outline-none transition-all cursor-pointer appearance-none"
                    style={{ 
                      borderColor: startTime ? brand.color : "#E5E7EB",
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 12px center",
                      backgroundSize: "20px",
                    }}
                  >
                    <option value="" disabled>Select start time</option>
                    {startTimes.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-800 mb-2 block">Willing to undergo training?</label>
                  <select
                    value={willingToTrain}
                    onChange={(e) => setWillingToTrain(e.target.value)}
                    className="w-full rounded-xl border-2 bg-white px-4 py-3 text-sm text-gray-900 focus:outline-none transition-all cursor-pointer appearance-none"
                    style={{ 
                      borderColor: willingToTrain ? brand.color : "#E5E7EB",
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 12px center",
                      backgroundSize: "20px",
                    }}
                  >
                    <option value="" disabled>Select option</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 2: Your Preferences */}
          {step === 2 && (
            <motion.div key="s2" {...pageVariants} transition={{ duration: 0.4 }}>
              <div className="text-center mb-8">
                <div className="mx-auto w-full max-w-md h-40 sm:h-48 rounded-2xl overflow-hidden mb-4 border-2 shadow-lg" style={{ borderColor: brand.color }}>
                  <img src={brand.image} alt={brand.name} className="w-full h-full object-cover" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Your Preferences</h2>
                <p className="text-gray-500">Work type, salary, education & experience</p>
              </div>
              <div className="space-y-5 bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                {[
                  { label: "Preferred Work Type", options: workTypes, value: workType, set: setWorkType },
                  { label: "Preferred Interview Mode", options: interviewModes, value: interviewMode, set: setInterviewMode },
                  { label: "Employment Type", options: employmentTypes, value: employmentType, set: setEmploymentType },
                  { label: "Expected Salary Range (KES)", options: salaryRanges, value: salary, set: setSalary },
                  { label: "Education Level", options: educationLevels, value: education, set: setEducation },
                  { label: "Work Experience", options: experienceLevels, value: experience, set: setExperience },
                ].map((section) => (
                  <div key={section.label}>
                    <label className="text-sm font-semibold text-gray-800 mb-2 block">{section.label}</label>
                    <select
                      value={section.value}
                      onChange={(e) => section.set(e.target.value)}
                      className="w-full rounded-xl border-2 bg-white px-4 py-3 text-sm text-gray-900 focus:outline-none transition-all cursor-pointer appearance-none"
                      style={{ 
                        borderColor: section.value ? brand.color : "#E5E7EB",
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "right 12px center",
                        backgroundSize: "20px",
                      }}
                    >
                      <option value="" disabled>Select {section.label.toLowerCase()}</option>
                      {section.options.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 3: Processing */}
          {step === 3 && (
            <motion.div key="s3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center min-h-[60vh]">
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 100 }}
                className="bg-white rounded-3xl p-8 shadow-xl border-2 w-full max-w-md"
                style={{ borderColor: brand.color + "30", boxShadow: `0 20px 60px ${brand.color}15` }}
              >
                {/* Animated Loader */}
                <div className="relative w-28 h-28 mx-auto mb-8">
                  {/* Outer ring */}
                  <div className="absolute inset-0 rounded-full border-4" style={{ borderColor: "#E5E7EB" }} />
                  {/* Spinning progress ring */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 rounded-full border-4 border-t-transparent"
                    style={{ borderColor: brand.color, borderTopColor: "transparent" }}
                  />
                  {/* Inner content */}
                  <div className="absolute inset-2 rounded-full flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${brand.color}10, ${brand.color}20)` }}>
                    {(() => {
                      const Icon = processingStages[processingStage]?.icon || Loader2;
                      return (
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        >
                          <Icon className="h-10 w-10" style={{ color: brand.color }} />
                        </motion.div>
                      );
                    })()}
                  </div>
                </div>

                {/* Title */}
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-2xl font-extrabold text-gray-900 text-center mb-2"
                >
                  Processing Application
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-gray-600 text-center mb-8 text-sm"
                >
                  Please wait while we review your details...
                </motion.p>

                {/* Processing Stages */}
                <div className="space-y-4">
                  {processingStages.map((stage, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.15 }}
                      className="flex items-center gap-4 p-3 rounded-xl transition-all"
                      style={{
                        backgroundColor: i <= processingStage ? brand.color + "08" : "transparent",
                        border: `2px solid ${i <= processingStage ? brand.color + "30" : "#E5E7EB"}`,
                      }}
                    >
                      {/* Status Icon */}
                      <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                        style={{
                          backgroundColor: i < processingStage ? brand.color : i === processingStage ? brand.color + "20" : "#F3F4F6",
                        }}
                      >
                        {i < processingStage ? (
                          <CheckCircle2 className="h-5 w-5 text-white" />
                        ) : i === processingStage ? (
                          <Loader2 className="h-5 w-5 animate-spin" style={{ color: brand.color }} />
                        ) : (
                          <div className="h-2 w-2 rounded-full" style={{ backgroundColor: "#D1D5DB" }} />
                        )}
                      </div>

                      {/* Label */}
                      <div className="flex-1">
                        <span
                          className="text-sm font-bold block"
                          style={{
                            color: i < processingStage ? "#1F2937" : i === processingStage ? brand.color : "#9CA3AF",
                          }}
                        >
                          {stage.label}
                        </span>
                        {i === processingStage && (
                          <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-xs text-gray-500"
                          >
                            In progress...
                          </motion.span>
                        )}
                      </div>

                      {/* Progress indicator */}
                      {i === processingStage && (
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 2, ease: "linear" }}
                          className="h-1 rounded-full absolute bottom-0 left-0 right-0"
                          style={{ backgroundColor: brand.color }}
                        />
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Progress percentage */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-8"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-gray-600">Progress</span>
                    <span className="text-xs font-bold" style={{ color: brand.color }}>
                      {Math.round(((processingStage + 1) / processingStages.length) * 100)}%
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${((processingStage + 1) / processingStages.length) * 100}%` }}
                      transition={{ duration: 0.5 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: brand.color }}
                    />
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          )}

          {/* STEP 4: Results */}
          {step === 4 && (
            <motion.div key="s4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} className="flex flex-col items-center text-center">
              {/* Animated celebration background */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 150, damping: 15, delay: 0.1 }}
                className="relative w-28 h-28 rounded-full flex items-center justify-center mb-6"
                style={{ background: `linear-gradient(135deg, ${brand.color}20 0%, ${brand.color}40 100%)`, border: `3px solid ${brand.color}` }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 rounded-full"
                  style={{ border: `2px dashed ${brand.color}40`, borderTop: '2px solid transparent' }}
                />
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                >
                  <CheckCircle2 className="h-14 w-14" style={{ color: brand.color }} />
                </motion.div>
              </motion.div>

              {/* Congratulations text with gradient */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-6"
              >
                <h1 className="text-2xl font-bold mb-2" style={{ color: brand.color }}>
                  Congratulations!
                </h1>
                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
                  You Qualify! 🎉
                </h2>
                <p className="text-gray-600 text-lg">You meet all requirements for this position</p>
              </motion.div>

              {/* Stylish slots card */}
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
                className="w-full rounded-3xl bg-white p-6 mb-6 shadow-xl"
                style={{ border: `2px solid ${brand.color}30`, boxShadow: `0 20px 60px ${brand.color}15` }}
              >
                {/* Slots header */}
                <div className="flex items-center justify-between mb-5 pb-4 border-b-2" style={{ borderColor: brand.color + "15" }}>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: brand.color + "15" }}>
                      <Briefcase className="h-4 w-4" style={{ color: brand.color }} />
                    </div>
                    <span className="text-base font-bold text-gray-800">Open Positions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Available:</span>
                    <motion.span 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
                      className="text-3xl font-extrabold"
                      style={{ color: brand.color }}
                    >
                      2
                    </motion.span>
                  </div>
                </div>

                {/* Position cards */}
                <div className="space-y-4">
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex items-center gap-4 rounded-2xl p-4 border-2 transition-all hover:shadow-md"
                    style={{ backgroundColor: brand.color + "05", borderColor: brand.color + "20" }}
                  >
                    <div className="relative">
                      <img src={positionImages[selectedPosition]} alt={selectedPosition} className="h-14 w-14 rounded-xl object-cover shadow-md" />
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: brand.color }}>
                        <CheckCircle2 className="h-3 w-3 text-white" />
                      </div>
                    </div>
                    <div className="text-left flex-1">
                      <p className="text-base font-bold text-gray-900">{selectedPosition}</p>
                      <p className="text-sm font-medium" style={{ color: brand.color }}>{brand.name} — Full Time</p>
                    </div>
                    <div className="px-3 py-1 rounded-full text-xs font-bold text-white" style={{ backgroundColor: brand.color }}>
                      Slot 1
                    </div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 }}
                    className="flex items-center gap-4 rounded-2xl p-4 border-2 transition-all hover:shadow-md"
                    style={{ backgroundColor: brand.color + "05", borderColor: brand.color + "20" }}
                  >
                    <div className="relative">
                      <img src={positionImages[selectedPosition]} alt={selectedPosition} className="h-14 w-14 rounded-xl object-cover shadow-md" />
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: brand.color }}>
                        <CheckCircle2 className="h-3 w-3 text-white" />
                      </div>
                    </div>
                    <div className="text-left flex-1">
                      <p className="text-base font-bold text-gray-900">{selectedPosition}</p>
                      <p className="text-sm font-medium" style={{ color: brand.color }}>{brand.name} — {workType || "Full Time"}</p>
                    </div>
                    <div className="px-3 py-1 rounded-full text-xs font-bold text-white" style={{ backgroundColor: brand.color }}>
                      Slot 2
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              {/* Action button */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => { setStep(5); setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 50); }}
                className="w-full flex items-center justify-center gap-3 rounded-2xl px-8 py-5 font-bold text-white text-base transition-all shadow-xl cursor-pointer"
                style={{ background: `linear-gradient(135deg, ${brand.color} 0%, ${brand.color}DD 100%)`, boxShadow: `0 10px 40px ${brand.color}50` }}
              >
                <Calendar className="h-5 w-5" />
                Book Your Interview Now
                <ArrowRight className="h-5 w-5" />
              </motion.button>
            </motion.div>
          )}

          {/* STEP 5: Book Interview */}
          {step === 5 && (
            <motion.div key="s5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
              {/* Header */}
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-center mb-8"
              >
                <div className="relative mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-5" style={{ background: `linear-gradient(135deg, ${brand.color}20, ${brand.color}40)`, border: `3px solid ${brand.color}` }}>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-2 rounded-full border-2 border-dashed"
                    style={{ borderColor: brand.color + "30" }}
                  />
                  <Calendar className="h-8 w-8" style={{ color: brand.color }} />
                </div>
                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">Schedule Interview</h2>
                <p className="text-gray-600 text-lg">Pick your preferred date, time & contact method</p>
              </motion.div>

              {/* Main Card */}
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
                className="bg-white rounded-3xl p-6 mb-6 shadow-xl"
                style={{ border: `2px solid ${brand.color}20`, boxShadow: `0 20px 60px ${brand.color}15` }}
              >
                {/* Date Selection */}
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: brand.color + "15" }}>
                      <Calendar className="h-4 w-4" style={{ color: brand.color }} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Select Date</h3>
                  </div>
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                    {dates.map((d, i) => (
                      <motion.button
                        key={d.toISOString()}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 + i * 0.05 }}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedDate(d)}
                        className="flex flex-col items-center rounded-2xl border-2 p-3 transition-all duration-300"
                        style={{
                          borderColor: selectedDate?.toDateString() === d.toDateString() ? brand.color : "#E5E7EB",
                          backgroundColor: selectedDate?.toDateString() === d.toDateString() ? brand.color : "white",
                          boxShadow: selectedDate?.toDateString() === d.toDateString() ? `0 8px 25px ${brand.color}40` : "none",
                        }}
                      >
                        <span className="text-xs font-medium" style={{ color: selectedDate?.toDateString() === d.toDateString() ? "white" : "#6B7280" }}>
                          {d.toLocaleDateString("en-US", { weekday: "short" })}
                        </span>
                        <span className="text-xl font-extrabold my-1" style={{ color: selectedDate?.toDateString() === d.toDateString() ? "white" : "#1F2937" }}>
                          {d.getDate()}
                        </span>
                        <span className="text-xs font-medium" style={{ color: selectedDate?.toDateString() === d.toDateString() ? "white" : "#6B7280" }}>
                          {d.toLocaleDateString("en-US", { month: "short" })}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Time Selection */}
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: brand.color + "15" }}>
                      <Clock className="h-4 w-4" style={{ color: brand.color }} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Select Time</h3>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {timeSlots.map((t, i) => (
                      <motion.button
                        key={t}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + i * 0.05 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedTime(t)}
                        className="px-5 py-2.5 rounded-xl font-semibold text-sm transition-all border-2"
                        style={{
                          borderColor: selectedTime === t ? brand.color : "#E5E7EB",
                          backgroundColor: selectedTime === t ? brand.color : "white",
                          color: selectedTime === t ? "white" : "#374151",
                          boxShadow: selectedTime === t ? `0 4px 15px ${brand.color}40` : "none",
                        }}
                      >
                        {t}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Contact Method */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: brand.color + "15" }}>
                      <MessageCircle className="h-4 w-4" style={{ color: brand.color }} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">How should we contact you?</h3>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {contactMethods.map((m, i) => (
                      <motion.button
                        key={m.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + i * 0.08 }}
                        whileHover={{ scale: 1.03, y: -2 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setContactMethod(m.id)}
                        className="flex flex-col items-center gap-3 rounded-2xl border-2 p-5 transition-all duration-300"
                        style={{
                          borderColor: contactMethod === m.id ? brand.color : "#E5E7EB",
                          backgroundColor: contactMethod === m.id ? brand.color : "white",
                          boxShadow: contactMethod === m.id ? `0 8px 25px ${brand.color}40` : "0 2px 10px rgba(0,0,0,0.05)",
                        }}
                      >
                        <m.icon className="h-6 w-6" style={{ color: contactMethod === m.id ? "white" : brand.color }} />
                        <span className="text-sm font-bold" style={{ color: contactMethod === m.id ? "white" : "#374151" }}>{m.label}</span>
                        <span className="text-xs" style={{ color: contactMethod === m.id ? "white" : "#9CA3AF" }}>
                          {m.id === "call" ? "Phone call" : m.id === "sms" ? "SMS / WhatsApp" : "Email"}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Contact Input */}
                {contactMethod && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ delay: 0.3 }}
                    className="pt-4 border-t-2"
                    style={{ borderColor: brand.color + "15" }}
                  >
                    <label className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: brand.color + "15" }}>
                        {contactMethod === "email" ? <Mail className="h-3 w-3" style={{ color: brand.color }} /> : <Phone className="h-3 w-3" style={{ color: brand.color }} />}
                      </div>
                      Your {contactMethod === "email" ? "Email Address" : "Phone Number"}
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: brand.color + "10" }}>
                        {contactMethod === "email" ? <Mail className="h-5 w-5" style={{ color: brand.color }} /> : <Phone className="h-5 w-5" style={{ color: brand.color }} />}
                      </div>
                      <input
                        value={contactValue}
                        onChange={(e) => setContactValue(e.target.value)}
                        placeholder={contactMethod === "email" ? "john@example.com" : "0712 345 678"}
                        className="w-full rounded-2xl border-2 bg-white pl-16 pr-4 py-4 text-base font-medium transition-all"
                        style={{ 
                          borderColor: contactValue ? brand.color : "#E5E7EB",
                          boxShadow: contactValue ? `0 0 0 4px ${brand.color}15` : "none",
                          color: "#1F2937"
                        }}
                        onFocus={(e) => { e.target.style.borderColor = brand.color; e.target.style.boxShadow = `0 0 0 4px ${brand.color}20`; }}
                        onBlur={(e) => { if (!contactValue) { e.target.style.borderColor = "#E5E7EB"; e.target.style.boxShadow = "none"; } }}
                      />
                    </div>
                  </motion.div>
                )}
              </motion.div>

              {/* Summary Card */}
              {(selectedDate && selectedTime) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white rounded-2xl p-5 mb-6 border-2"
                  style={{ borderColor: brand.color + "20" }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: brand.color + "15" }}>
                      <CheckCircle2 className="h-5 w-5" style={{ color: brand.color }} />
                    </div>
                    <span className="font-bold text-gray-900">Interview Scheduled</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="h-4 w-4" style={{ color: brand.color }} />
                      <span>{selectedDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="h-4 w-4" style={{ color: brand.color }} />
                      <span>{selectedTime}</span>
                    </div>
                    {contactValue && (
                      <div className="flex items-center gap-2 text-gray-600">
                        {contactMethod === "email" ? <Mail className="h-4 w-4" style={{ color: brand.color }} /> : <Phone className="h-4 w-4" style={{ color: brand.color }} />}
                        <span>{contactValue}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* STEP 6: Payment */}
          {step === 6 && (
            <motion.div key="s6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="text-center mb-6"
              >
                <div className="relative mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-4" style={{ background: `linear-gradient(135deg, ${brand.color}20, ${brand.color}40)`, border: `3px solid ${brand.color}` }}>
                  <Shield className="h-8 w-8" style={{ color: brand.color }} />
                  <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: brand.color }}>
                    <CheckCircle2 className="h-4 w-4 text-white" />
                  </div>
                </div>
                <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Secure Your Interview</h2>
                <p className="text-gray-600 text-base">Complete payment to confirm your booking</p>
              </motion.div>

              {/* Interview Details Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-3xl p-6 mb-6 shadow-xl border-2"
                style={{ borderColor: brand.color + "30", boxShadow: `0 20px 60px ${brand.color}15` }}
              >
                {/* Position Header */}
                <div className="flex items-center gap-4 mb-5 pb-5 border-b-2" style={{ borderColor: brand.color + "15" }}>
                  <div className="relative">
                    <img src={positionImages[selectedPosition]} alt={selectedPosition} className="h-16 w-16 rounded-2xl object-cover shadow-md" />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: brand.color }}>
                      <CheckCircle2 className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: brand.color }}>APPROVED FOR</p>
                    <h3 className="text-xl font-bold text-gray-900">{selectedPosition}</h3>
                    <p className="text-sm font-medium text-gray-600">{brand.name}</p>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4 mb-5">
                  <div className="rounded-xl p-4" style={{ backgroundColor: brand.color + "08" }}>
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4" style={{ color: brand.color }} />
                      <span className="text-xs font-semibold text-gray-700">Interview Date</span>
                    </div>
                    <p className="font-bold text-gray-900 text-sm">{selectedDate ? selectedDate.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }) : ""}</p>
                  </div>
                  <div className="rounded-xl p-4" style={{ backgroundColor: brand.color + "08" }}>
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4" style={{ color: brand.color }} />
                      <span className="text-xs font-semibold text-gray-700">Time</span>
                    </div>
                    <p className="font-bold text-gray-900 text-sm">{selectedTime}</p>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="rounded-xl p-4 mb-5 flex items-center gap-3" style={{ backgroundColor: "#F3F4F6" }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: brand.color + "15" }}>
                    {contactMethod === "email" ? <Mail className="h-5 w-5" style={{ color: brand.color }} /> : <Phone className="h-5 w-5" style={{ color: brand.color }} />}
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Confirmation will be sent to</p>
                    <p className="font-semibold text-gray-900">{contactValue}</p>
                  </div>
                </div>

                {/* Fee Section */}
                <div className="rounded-2xl p-5 border-2" style={{ backgroundColor: brand.color + "05", borderColor: brand.color + "20" }}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-gray-700">Processing Fee</span>
                    <span className="text-3xl font-extrabold" style={{ color: brand.color }}>KES {brand.processingFee}</span>
                  </div>
                  <p className="text-xs text-gray-500 mb-3 leading-relaxed">
                    This interview booking fee is required to <strong>guarantee your attendance</strong>. It ensures commitment and helps us schedule interviews efficiently.
                  </p>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: "#10B981" }}>
                      <CheckCircle2 className="h-3 w-3 text-white" />
                    </div>
                    <span className="text-gray-600"><strong>100% Refundable</strong> when you attend the interview</span>
                  </div>
                </div>
              </motion.div>

              {/* Trust Badges */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="grid grid-cols-3 gap-3 mb-6"
              >
                {[
                  { icon: Shield, text: "Secure Payment" },
                  { icon: CheckCircle2, text: "Instant Confirmation" },
                  { icon: Clock, text: "24hr Support" },
                ].map((badge, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 p-3 rounded-xl" style={{ backgroundColor: brand.color + "08" }}>
                    <badge.icon className="h-5 w-5" style={{ color: brand.color }} />
                    <span className="text-xs font-semibold text-gray-700 text-center">{badge.text}</span>
                  </div>
                ))}
              </motion.div>

              {/* M-Pesa Payment Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-3xl p-6 mb-6 shadow-lg border-2"
                style={{ borderColor: paymentStatus === 'processing' ? brand.color : "#00A650" }}
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden" style={{ backgroundColor: "#00A65015" }}>
                    <img src={mpesaLogo} alt="M-Pesa" className="h-10 w-10 object-contain" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">M-Pesa Payment</h3>
                    <p className="text-xs text-gray-500">
                      {paymentStatus === 'processing' 
                        ? "Processing payment... Check your phone" 
                        : paymentStatus === 'completed'
                        ? "Payment successful!"
                        : paymentStatus === 'failed'
                        ? "Payment failed. Try again"
                        : "STK Push will be sent to your phone"}
                    </p>
                  </div>
                </div>

                {/* Processing Indicator */}
                {paymentStatus === 'processing' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mb-4 p-4 rounded-xl flex items-center gap-3"
                    style={{ backgroundColor: brand.color + "10" }}
                  >
                    <Loader2 className="h-5 w-5 animate-spin" style={{ color: brand.color }} />
                    <span className="text-sm font-semibold" style={{ color: brand.color }}>
                      Waiting for M-Pesa confirmation...
                    </span>
                  </motion.div>
                )}

                {/* Payment Failed Message */}
                {paymentStatus === 'failed' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mb-4 p-4 rounded-xl flex items-center gap-3 bg-red-50 border border-red-200"
                  >
                    <XCircle className="h-5 w-5 text-red-500" />
                    <span className="text-sm font-semibold text-red-600">
                      Payment failed. Please try again.
                    </span>
                  </motion.div>
                )}

                <label className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Phone className="h-4 w-4" style={{ color: brand.color }} />
                  M-Pesa Phone Number
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: brand.color + "10" }}>
                    <Phone className="h-5 w-5" style={{ color: brand.color }} />
                  </div>
                  <input
                    value={mpesaNumber}
                    onChange={(e) => {
                      setMpesaNumber(e.target.value);
                      if (paymentStatus === 'failed') setPaymentStatus('idle');
                    }}
                    placeholder="e.g. 0712 345 678"
                    disabled={paymentStatus === 'processing'}
                    className="w-full rounded-2xl border-2 bg-white pl-16 pr-4 py-5 text-lg font-bold transition-all disabled:opacity-50"
                    style={{
                      borderColor: mpesaNumber ? "#00A650" : "#E5E7EB",
                      boxShadow: mpesaNumber ? `0 0 0 4px ${brand.color}15` : "none",
                      color: "#1F2937"
                    }}
                    onFocus={(e) => { e.target.style.borderColor = "#00A650"; e.target.style.boxShadow = `0 0 0 4px #00A65020`; }}
                    onBlur={(e) => { if (!mpesaNumber) { e.target.style.borderColor = "#E5E7EB"; e.target.style.boxShadow = "none"; } }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-3 flex items-center gap-1">
                  <Shield className="h-3 w-3" />
                  Your number is secure and encrypted
                </p>
              </motion.div>

              {/* Recent Payments - Social Proof */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="rounded-2xl p-4 mb-6"
                style={{ backgroundColor: "#ECFDF5" }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: brand.color }}>
                        {String.fromCharCode(64 + i)}
                      </div>
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-gray-700">+12 booked today</span>
                </div>
                <p className="text-xs text-gray-600">Last booking: 2 minutes ago from Nairobi</p>
              </motion.div>
            </motion.div>
          )}

          {/* STEP 7: Success */}
          {step === 7 && (
            <motion.div key="s7" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} className="flex flex-col items-center text-center">
              {/* Animated Success Icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 150, damping: 15, delay: 0.1 }}
                className="relative w-28 h-28 rounded-full flex items-center justify-center mb-6"
                style={{ background: `linear-gradient(135deg, ${brand.color}20 0%, ${brand.color}50 100%)`, border: `4px solid ${brand.color}` }}
              >
                {/* Rotating ring */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 rounded-full border-2 border-dashed"
                  style={{ borderColor: brand.color + "40", borderTopColor: "transparent" }}
                />
                {/* Confetti particles */}
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className="absolute w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: brand.color,
                      top: `${20 + Math.random() * 60}%`,
                      left: `${20 + Math.random() * 60}%`,
                    }}
                  />
                ))}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                >
                  <CheckCircle2 className="h-14 w-14 text-white" />
                </motion.div>
              </motion.div>

              {/* Success Message */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-6"
              >
                <h1 className="text-2xl font-bold mb-2" style={{ color: brand.color }}>
                  Congratulations!
                </h1>
                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
                  Booking Confirmed! 🎉
                </h2>
                <p className="text-gray-600 text-lg max-w-sm mx-auto">
                  Your interview has been scheduled successfully. Check your {contactMethod === "email" ? "email" : "phone"} for details.
                </p>
              </motion.div>

              {/* Interview Details Card */}
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
                className="w-full bg-white rounded-3xl p-6 mb-6 shadow-xl border-2"
                style={{ borderColor: brand.color + "30", boxShadow: `0 20px 60px ${brand.color}15` }}
              >
                {/* Header with image */}
                <div className="flex items-center gap-4 mb-5 pb-5 border-b-2" style={{ borderColor: brand.color + "15" }}>
                  <div className="relative">
                    <img src={positionImages[selectedPosition]} alt={selectedPosition} className="h-16 w-16 rounded-2xl object-cover shadow-md" />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: "#10B981" }}>
                      <CheckCircle2 className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: brand.color }}>BOOKED</p>
                    <h3 className="text-xl font-bold text-gray-900">{selectedPosition}</h3>
                    <p className="text-sm font-medium text-gray-600">{brand.name}</p>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="rounded-xl p-4 text-left" style={{ backgroundColor: brand.color + "08" }}>
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4" style={{ color: brand.color }} />
                      <span className="text-xs font-semibold text-gray-700">Date</span>
                    </div>
                    <p className="font-bold text-gray-900 text-sm">{selectedDate ? selectedDate.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }) : ""}</p>
                  </div>
                  <div className="rounded-xl p-4 text-left" style={{ backgroundColor: brand.color + "08" }}>
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4" style={{ color: brand.color }} />
                      <span className="text-xs font-semibold text-gray-700">Time</span>
                    </div>
                    <p className="font-bold text-gray-900 text-sm">{selectedTime}</p>
                  </div>
                </div>

                {/* Confirmation Info */}
                <div className="rounded-xl p-4 flex items-center gap-3" style={{ backgroundColor: "#ECFDF5", border: "1px solid #10B981" }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: "#10B981" }}>
                    {contactMethod === "email" ? <Mail className="h-5 w-5 text-white" /> : <Phone className="h-5 w-5 text-white" />}
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-gray-600">Confirmation sent to</p>
                    <p className="font-semibold text-gray-900">{contactValue}</p>
                  </div>
                </div>
              </motion.div>

              {/* What's Next */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="w-full bg-white rounded-2xl p-5 mb-6 shadow-lg border"
                style={{ borderColor: brand.color + "20" }}
              >
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: brand.color + "15" }}>
                    <Briefcase className="h-4 w-4" style={{ color: brand.color }} />
                  </div>
                  What's Next?
                </h3>
                <div className="space-y-3">
                  {[
                    { step: "1", text: "Check your phone for M-Pesa confirmation" },
                    { step: "2", text: "Arrive 15 minutes early for your interview" },
                    { step: "3", text: "Bring your ID and any relevant documents" },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + i * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ backgroundColor: brand.color }}>
                        {item.step}
                      </div>
                      <p className="text-sm text-gray-700 text-left">{item.text}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="w-full space-y-3"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { navigate("/"); setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 50); }}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl px-6 py-4 font-bold text-white text-base transition-all shadow-xl cursor-pointer"
                  style={{ background: `linear-gradient(135deg, ${brand.color} 0%, ${brand.color}DD 100%)`, boxShadow: `0 10px 40px ${brand.color}50` }}
                >
                  <ArrowLeft className="h-5 w-5" />
                  Back to Home
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom CTA */}
        {[0, 1, 2, 5, 6].includes(step) && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8">
            <button
              onClick={nextStep}
              disabled={!canProceed()}
              className="w-full flex items-center justify-center gap-2 rounded-xl px-6 py-4 font-semibold text-white text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.02] hover:shadow-lg cursor-pointer"
              style={{ backgroundColor: brand.color }}
            >
              {step === 5 ? "Confirm & Continue" : step === 6 ? `Pay KES ${brand.processingFee} via M-Pesa` : "Continue"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Apply;
