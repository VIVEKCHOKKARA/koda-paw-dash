import { useState } from "react";
import { PageLayout } from "@/components/PageLayout";
import { VetMap } from "@/components/VetMap";
import { useAuth } from "@/contexts/AuthContext";
import {
  Stethoscope, MapPin, Clock, Phone, Star, CalendarPlus,
  Map, ChevronRight, User, X, Check, AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

interface Vet {
  id: string; name: string; specialty: string; clinic: string;
  rating: number; distance: string; phone: string; available: string[];
  image: string;
}

interface Appointment {
  pet: string; vet: string; clinic: string; date: string; time: string;
  type: string; status: "confirmed" | "pending" | "completed";
  customerName?: string;
}

const vets: Vet[] = [
  { id: "1", name: "Dr. Sarah Chen", specialty: "General Practice", clinic: "Greenfield Veterinary", rating: 4.9, distance: "1.2 km", phone: "+1 (555) 234-5678", available: ["Mon", "Wed", "Fri"], image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop" },
  { id: "2", name: "Dr. Raj Patel", specialty: "Dental Care", clinic: "PawCare Clinic", rating: 4.7, distance: "2.8 km", phone: "+1 (555) 345-6789", available: ["Tue", "Thu", "Sat"], image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop" },
  { id: "3", name: "Dr. Emily Kim", specialty: "Aquatic Animals", clinic: "AquaVet Center", rating: 4.8, distance: "3.5 km", phone: "+1 (555) 456-7890", available: ["Mon", "Tue", "Thu"], image: "https://images.unsplash.com/photo-1594824476967-48c8b964ac31?w=100&h=100&fit=crop" },
  { id: "4", name: "Dr. James Wilson", specialty: "Exotic & Reptiles", clinic: "Wild Care Hospital", rating: 4.6, distance: "4.1 km", phone: "+1 (555) 567-8901", available: ["Wed", "Fri", "Sat"], image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=100&h=100&fit=crop" },
];

const statusColors = {
  confirmed: "bg-primary/10 text-primary",
  pending: "bg-koda-warm/10 text-koda-warm",
  completed: "bg-muted text-muted-foreground",
};

export default function VetAppointments() {
  const { role } = useAuth();
  const [showMap, setShowMap] = useState(false);
  const [bookingVet, setBookingVet] = useState<Vet | null>(null);
  const [bookingForm, setBookingForm] = useState({ pet: "", date: "", time: "", type: "General Checkup" });
  const [appointments, setAppointments] = useState<Appointment[]>([
    { pet: "Milo", vet: "Dr. Chen", clinic: "Greenfield Vet", date: "Today", time: "2:00 PM", type: "Annual Checkup", status: "confirmed", customerName: "John D." },
    { pet: "Luna", vet: "Dr. Patel", clinic: "PawCare", date: "Thu, Mar 21", time: "10:00 AM", type: "Dental Cleaning", status: "pending", customerName: "Sarah M." },
    { pet: "Oscar", vet: "Dr. Kim", clinic: "AquaVet", date: "Sat, Mar 23", time: "3:00 PM", type: "Scale Check", status: "confirmed", customerName: "Mike T." },
  ]);

  const handleBook = () => {
    if (!bookingVet || !bookingForm.pet || !bookingForm.date || !bookingForm.time) {
      toast({ title: "Missing fields", description: "Please fill in all fields", variant: "destructive" });
      return;
    }
    setAppointments((prev) => [...prev, {
      pet: bookingForm.pet, vet: bookingVet.name, clinic: bookingVet.clinic,
      date: bookingForm.date, time: bookingForm.time, type: bookingForm.type,
      status: "pending", customerName: "You",
    }]);
    toast({ title: "Appointment Booked! 🎉", description: `Booked with ${bookingVet.name} on ${bookingForm.date}` });
    setBookingVet(null);
    setBookingForm({ pet: "", date: "", time: "", type: "General Checkup" });
  };

  const handleAccept = (index: number) => {
    setAppointments((prev) => prev.map((a, i) => i === index ? { ...a, status: "confirmed" } : a));
    toast({ title: "Appointment Accepted ✅", description: "Patient has been notified." });
  };

  return (
    <PageLayout>
      <div className="max-w-6xl mx-auto px-8 py-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-8 animate-reveal-up">
          <div>
            <p className="text-sm text-muted-foreground">
              {role === "doctor" ? "Manage patient appointments 🩺" : "Manage your vet visits 🩺"}
            </p>
            <h1 className="text-3xl font-display font-bold text-foreground mt-1" style={{ lineHeight: 1.1 }}>
              Vet Appointments
            </h1>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowMap(!showMap)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 active:scale-[0.98]",
                showMap ? "bg-primary text-primary-foreground shadow-md" : "border border-border/40 bg-card/80 text-foreground hover:bg-muted"
              )}
            >
              <Map className="w-4 h-4" /> Nearby Hospitals
            </button>
            {role !== "doctor" && (
              <button
                onClick={() => setBookingVet(vets[0])}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 active:scale-[0.98] transition-all duration-200 shadow-md"
              >
                <CalendarPlus className="w-4 h-4" /> Book Appointment
              </button>
            )}
          </div>
        </div>

        {/* Map */}
        {showMap && (
          <div className="glass-card-elevated rounded-2xl overflow-hidden mb-6 animate-reveal-up">
            <div className="flex items-center gap-2 px-6 pt-5 pb-3">
              <Map className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-display font-semibold text-foreground">Nearby Veterinary Hospitals</h2>
            </div>
            <div className="h-[350px] px-6 pb-5">
              <VetMap />
            </div>
          </div>
        )}

        {/* Booking Modal */}
        {bookingVet && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm animate-fade-in">
            <div className="glass-card-elevated rounded-2xl p-6 w-full max-w-md animate-scale-in">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-display font-semibold text-foreground">Book Appointment</h2>
                <button onClick={() => setBookingVet(null)} className="p-1 rounded-lg hover:bg-muted"><X className="w-5 h-5" /></button>
              </div>

              {/* Vet selector */}
              <div className="mb-4">
                <label className="text-xs font-medium text-muted-foreground mb-2 block">Select Veterinarian</label>
                <div className="space-y-2">
                  {vets.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setBookingVet(v)}
                      className={cn(
                        "w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 text-left",
                        bookingVet.id === v.id ? "bg-primary/10 border border-primary/30" : "bg-muted/40 hover:bg-muted/60"
                      )}
                    >
                      <img src={v.image} alt={v.name} className="w-10 h-10 rounded-lg object-cover" />
                      <div>
                        <p className="text-sm font-medium text-foreground">{v.name}</p>
                        <p className="text-xs text-muted-foreground">{v.specialty}</p>
                      </div>
                      {bookingVet.id === v.id && <Check className="w-4 h-4 text-primary ml-auto" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Pet Name</label>
                  <input value={bookingForm.pet} onChange={(e) => setBookingForm((f) => ({ ...f, pet: e.target.value }))} placeholder="e.g. Milo" className="w-full px-3 py-2.5 rounded-xl bg-muted/60 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Date</label>
                    <input type="date" value={bookingForm.date} onChange={(e) => setBookingForm((f) => ({ ...f, date: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl bg-muted/60 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Time</label>
                    <input type="time" value={bookingForm.time} onChange={(e) => setBookingForm((f) => ({ ...f, time: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl bg-muted/60 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Visit Type</label>
                  <select value={bookingForm.type} onChange={(e) => setBookingForm((f) => ({ ...f, type: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl bg-muted/60 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30">
                    {["General Checkup", "Vaccination", "Dental Cleaning", "Emergency", "Surgery", "Follow-up"].map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button onClick={handleBook} className="w-full mt-5 px-4 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 active:scale-[0.98] transition-all duration-200">
                Confirm Booking
              </button>
            </div>
          </div>
        )}

        {/* Appointments */}
        <div className="glass-card-elevated rounded-2xl p-6 mb-6 animate-reveal-up stagger-1">
          <h2 className="text-lg font-display font-semibold text-foreground mb-5">
            {role === "doctor" ? "Patient Appointments" : "Upcoming Appointments"}
          </h2>
          <div className="space-y-3">
            {appointments.map((apt, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-muted/40 hover:bg-muted/60 transition-all duration-200 group">
                <div className="w-11 h-11 rounded-xl bg-koda-sage-light flex items-center justify-center text-sm font-bold text-primary">
                  {apt.pet[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">
                    {apt.pet}
                    {role === "doctor" && apt.customerName && (
                      <span className="text-muted-foreground font-normal ml-2">— {apt.customerName}</span>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <Stethoscope className="w-3 h-3" /> {apt.vet} — {apt.clinic} · {apt.type}
                  </p>
                </div>
                <div className="text-right shrink-0 flex items-center gap-3">
                  <div>
                    <p className="text-xs font-medium text-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3 text-muted-foreground" /> {apt.time}
                    </p>
                    <p className="text-xs text-muted-foreground">{apt.date}</p>
                  </div>
                  <span className={cn("text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full", statusColors[apt.status])}>
                    {apt.status}
                  </span>
                  {role === "doctor" && apt.status === "pending" && (
                    <button onClick={() => handleAccept(i)} className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 active:scale-95 transition-all">
                      Accept
                    </button>
                  )}
                  <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Available Vets */}
        <div className="animate-reveal-up stagger-3">
          <h2 className="text-lg font-display font-semibold text-foreground mb-5">Available Veterinarians</h2>
          <div className="grid grid-cols-2 gap-4">
            {vets.map((vet, i) => (
              <div key={vet.id} className="glass-card-elevated rounded-2xl p-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-reveal-up" style={{ animationDelay: `${(i + 4) * 80}ms` }}>
                <div className="flex items-start gap-4">
                  <img src={vet.image} alt={vet.name} className="w-12 h-12 rounded-xl object-cover" />
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-foreground">{vet.name}</h3>
                    <p className="text-xs text-muted-foreground">{vet.specialty}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3" /> {vet.clinic} · {vet.distance}
                    </p>
                    <div className="flex items-center gap-3 mt-3">
                      <span className="flex items-center gap-1 text-xs">
                        <Star className="w-3 h-3 text-koda-warm fill-koda-warm" /> {vet.rating}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Phone className="w-3 h-3" /> {vet.phone}
                      </span>
                    </div>
                    <div className="flex gap-1.5 mt-3">
                      {vet.available.map((day) => (
                        <span key={day} className="text-[10px] font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full">{day}</span>
                      ))}
                    </div>
                  </div>
                </div>
                {role !== "doctor" && (
                  <button onClick={() => setBookingVet(vet)} className="w-full mt-4 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 active:scale-[0.98] transition-all duration-200">
                    Book Appointment
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
