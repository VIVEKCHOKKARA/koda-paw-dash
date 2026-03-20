import { useState } from "react";
import { PageLayout } from "@/components/PageLayout";
import {
  Stethoscope,
  MapPin,
  Clock,
  Phone,
  Star,
  CalendarPlus,
  Map,
  ChevronRight,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Vet {
  id: string;
  name: string;
  specialty: string;
  clinic: string;
  rating: number;
  distance: string;
  phone: string;
  available: string[];
  image?: string;
}

interface Appointment {
  pet: string;
  vet: string;
  clinic: string;
  date: string;
  time: string;
  type: string;
  status: "confirmed" | "pending" | "completed";
}

const vets: Vet[] = [
  { id: "1", name: "Dr. Sarah Chen", specialty: "General Practice", clinic: "Greenfield Veterinary", rating: 4.9, distance: "1.2 km", phone: "+1 (555) 234-5678", available: ["Mon", "Wed", "Fri"] },
  { id: "2", name: "Dr. Raj Patel", specialty: "Dental Care", clinic: "PawCare Clinic", rating: 4.7, distance: "2.8 km", phone: "+1 (555) 345-6789", available: ["Tue", "Thu", "Sat"] },
  { id: "3", name: "Dr. Emily Kim", specialty: "Aquatic Animals", clinic: "AquaVet Center", rating: 4.8, distance: "3.5 km", phone: "+1 (555) 456-7890", available: ["Mon", "Tue", "Thu"] },
  { id: "4", name: "Dr. James Wilson", specialty: "Exotic & Reptiles", clinic: "Wild Care Hospital", rating: 4.6, distance: "4.1 km", phone: "+1 (555) 567-8901", available: ["Wed", "Fri", "Sat"] },
];

const appointments: Appointment[] = [
  { pet: "Milo", vet: "Dr. Chen", clinic: "Greenfield Vet", date: "Today", time: "2:00 PM", type: "Annual Checkup", status: "confirmed" },
  { pet: "Luna", vet: "Dr. Patel", clinic: "PawCare", date: "Thu, Mar 21", time: "10:00 AM", type: "Dental Cleaning", status: "pending" },
  { pet: "Oscar", vet: "Dr. Kim", clinic: "AquaVet", date: "Sat, Mar 23", time: "3:00 PM", type: "Scale Check", status: "confirmed" },
];

const statusColors = {
  confirmed: "bg-primary/10 text-primary",
  pending: "bg-koda-warm/10 text-koda-warm",
  completed: "bg-muted text-muted-foreground",
};

export default function VetAppointments() {
  const [showMap, setShowMap] = useState(false);

  return (
    <PageLayout>
      <div className="max-w-6xl mx-auto px-8 py-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-8 animate-reveal-up">
          <div>
            <p className="text-sm text-muted-foreground">Manage your vet visits 🩺</p>
            <h1 className="text-3xl font-display font-bold text-foreground mt-1" style={{ lineHeight: 1.1 }}>
              Vet Appointments
            </h1>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowMap(!showMap)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 active:scale-[0.98]",
                showMap
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "border border-border/40 bg-card/80 text-foreground hover:bg-muted"
              )}
            >
              <Map className="w-4 h-4" /> Nearby Hospitals
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 active:scale-[0.98] transition-all duration-200 shadow-md">
              <CalendarPlus className="w-4 h-4" /> Book Appointment
            </button>
          </div>
        </div>

        {/* Map placeholder */}
        {showMap && (
          <div className="glass-card-elevated rounded-2xl p-6 mb-6 animate-reveal-up">
            <div className="flex items-center gap-2 mb-4">
              <Map className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-display font-semibold text-foreground">Nearby Veterinary Hospitals</h2>
            </div>
            <div className="h-64 rounded-xl bg-muted/60 flex items-center justify-center border border-border/30 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-koda-sage-light/50 to-koda-sand-light/50" />
              <div className="relative text-center">
                <Map className="w-12 h-12 text-primary/30 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">Interactive map showing nearby vet hospitals</p>
                <p className="text-xs text-muted-foreground mt-1">4 veterinary clinics within 5km radius</p>
              </div>
              {/* Map pins */}
              {[
                { top: "25%", left: "30%", label: "Greenfield" },
                { top: "40%", left: "55%", label: "PawCare" },
                { top: "60%", left: "40%", label: "AquaVet" },
                { top: "35%", left: "70%", label: "Wild Care" },
              ].map((pin) => (
                <div key={pin.label} className="absolute animate-scale-in" style={{ top: pin.top, left: pin.left }}>
                  <div className="relative">
                    <MapPin className="w-6 h-6 text-primary fill-primary/20" />
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-semibold bg-background/90 text-foreground px-2 py-0.5 rounded-md shadow-sm whitespace-nowrap">
                      {pin.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Appointments */}
        <div className="glass-card-elevated rounded-2xl p-6 mb-6 animate-reveal-up stagger-1">
          <h2 className="text-lg font-display font-semibold text-foreground mb-5">Upcoming Appointments</h2>
          <div className="space-y-3">
            {appointments.map((apt, i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-4 rounded-xl bg-muted/40 hover:bg-muted/60 transition-all duration-200 group cursor-pointer"
              >
                <div className="w-11 h-11 rounded-xl bg-koda-sage-light flex items-center justify-center text-sm font-bold text-primary">
                  {apt.pet[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">{apt.pet}</p>
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
              <div
                key={vet.id}
                className="glass-card-elevated rounded-2xl p-5 hover:shadow-xl transition-shadow duration-300 animate-reveal-up"
                style={{ animationDelay: `${(i + 4) * 80}ms` }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <User className="w-6 h-6 text-primary" />
                  </div>
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
                        <span key={day} className="text-[10px] font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                          {day}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <button className="w-full mt-4 px-4 py-2.5 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-muted active:scale-[0.98] transition-all duration-200">
                  Book Appointment
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
