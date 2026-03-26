import { useState, useEffect } from "react";
import { PageLayout } from "@/components/PageLayout";
import { VetMap } from "@/components/VetMap";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import {
  Stethoscope, MapPin, Clock, CalendarPlus, Map, ChevronRight, X, Check, Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

interface Appointment {
  id: string; customer_id: string; doctor_id: string | null; pet_name: string;
  appointment_date: string; appointment_time: string; visit_type: string;
  status: string; notes: string | null; customer_name?: string;
}

interface VetLocation {
  id: string; doctor_id: string; clinic_name: string; latitude: number;
  longitude: number; phone: string | null; address: string | null;
}

export default function VetAppointments() {
  const { user, role } = useAuth();
  const [showMap, setShowMap] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  const [showAddLocation, setShowAddLocation] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [vetLocations, setVetLocations] = useState<VetLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingForm, setBookingForm] = useState({ pet: "", date: "", time: "", type: "General Checkup", doctor_id: "" });
  const [locationForm, setLocationForm] = useState({ clinic_name: "", latitude: "", longitude: "", phone: "", address: "" });

  const fetchData = async () => {
    setLoading(true);
    const [{ data: appts }, { data: locs }] = await Promise.all([
      supabase.from("appointments").select("*").order("appointment_date", { ascending: true }),
      supabase.from("vet_locations").select("*"),
    ]);
    if (appts) {
      // Enrich with customer names
      const enriched = await Promise.all(appts.map(async (a: any) => {
        const { data: prof } = await supabase.from("profiles").select("display_name").eq("user_id", a.customer_id).single();
        return { ...a, customer_name: prof?.display_name || "Customer" };
      }));
      setAppointments(enriched);
    }
    if (locs) setVetLocations(locs as VetLocation[]);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleBook = async () => {
    if (!user || !bookingForm.pet || !bookingForm.date || !bookingForm.time) {
      toast({ title: "Please fill in all fields", variant: "destructive" }); return;
    }
    await supabase.from("appointments").insert({
      customer_id: user.id,
      doctor_id: bookingForm.doctor_id || null,
      pet_name: bookingForm.pet,
      appointment_date: bookingForm.date,
      appointment_time: bookingForm.time,
      visit_type: bookingForm.type,
      status: "pending",
    });
    toast({ title: "Appointment Booked! 🎉" });
    setShowBooking(false);
    setBookingForm({ pet: "", date: "", time: "", type: "General Checkup", doctor_id: "" });
    fetchData();
  };

  const handleAccept = async (id: string) => {
    await supabase.from("appointments").update({ status: "confirmed", doctor_id: user?.id }).eq("id", id);
    toast({ title: "Appointment Accepted ✅" });
    fetchData();
  };

  const handleAddLocation = async () => {
    if (!user || !locationForm.clinic_name || !locationForm.latitude || !locationForm.longitude) {
      toast({ title: "Fill in clinic name and coordinates", variant: "destructive" }); return;
    }
    await supabase.from("vet_locations").insert({
      doctor_id: user.id,
      clinic_name: locationForm.clinic_name,
      latitude: parseFloat(locationForm.latitude),
      longitude: parseFloat(locationForm.longitude),
      phone: locationForm.phone,
      address: locationForm.address,
    });
    toast({ title: "Location added! 📍" });
    setShowAddLocation(false);
    setLocationForm({ clinic_name: "", latitude: "", longitude: "", phone: "", address: "" });
    fetchData();
  };

  const statusColors: Record<string, string> = {
    confirmed: "bg-primary/10 text-primary",
    pending: "bg-koda-warm/10 text-koda-warm",
    completed: "bg-muted text-muted-foreground",
    cancelled: "bg-destructive/10 text-destructive",
  };

  const myAppointments = role === "doctor"
    ? appointments
    : appointments.filter(a => a.customer_id === user?.id);

  return (
    <PageLayout>
      <div className="max-w-6xl mx-auto px-8 py-8">
        <div className="flex items-start justify-between mb-8 animate-reveal-up">
          <div>
            <p className="text-sm text-muted-foreground">{role === "doctor" ? "Manage patient appointments 🩺" : "Manage your vet visits 🩺"}</p>
            <h1 className="text-3xl font-display font-bold text-foreground mt-1" style={{ lineHeight: 1.1 }}>Vet Appointments</h1>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setShowMap(!showMap)}
              className={cn("flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all active:scale-[0.98]",
                showMap ? "bg-primary text-primary-foreground shadow-md" : "border border-border/40 bg-card/80 text-foreground hover:bg-muted")}>
              <Map className="w-4 h-4" /> Nearby Hospitals
            </button>
            {role === "doctor" && (
              <button onClick={() => setShowAddLocation(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border/40 bg-card/80 text-sm font-medium text-foreground hover:bg-muted active:scale-[0.98] transition-all">
                <Plus className="w-4 h-4" /> Add Location
              </button>
            )}
            {role !== "doctor" && (
              <button onClick={() => setShowBooking(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 active:scale-[0.98] transition-all shadow-md">
                <CalendarPlus className="w-4 h-4" /> Book Appointment
              </button>
            )}
          </div>
        </div>

        {showMap && (
          <div className="glass-card-elevated rounded-2xl overflow-hidden mb-6 animate-reveal-up">
            <div className="flex items-center gap-2 px-6 pt-5 pb-3">
              <Map className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-display font-semibold text-foreground">Nearby Veterinary Hospitals</h2>
            </div>
            <div className="h-[350px] px-6 pb-5">
              <VetMap locations={vetLocations} />
            </div>
          </div>
        )}

        {/* Booking Modal */}
        {showBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm animate-fade-in">
            <div className="glass-card-elevated rounded-2xl p-6 w-full max-w-md animate-scale-in">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-display font-semibold text-foreground">Book Appointment</h2>
                <button onClick={() => setShowBooking(false)} className="p-1 rounded-lg hover:bg-muted"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-3">
                {[["Pet Name", "pet", "text"], ["Date", "date", "date"], ["Time", "time", "time"]].map(([label, key, type]) => (
                  <div key={key}>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">{label}</label>
                    <input type={type} value={(bookingForm as any)[key]} onChange={(e) => setBookingForm(f => ({ ...f, [key]: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-xl bg-muted/60 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30" />
                  </div>
                ))}
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Visit Type</label>
                  <select value={bookingForm.type} onChange={(e) => setBookingForm(f => ({ ...f, type: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl bg-muted/60 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30">
                    {["General Checkup", "Vaccination", "Dental Cleaning", "Emergency", "Surgery", "Follow-up"].map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <button onClick={handleBook} className="w-full mt-5 px-4 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 active:scale-[0.98] transition-all">
                Confirm Booking
              </button>
            </div>
          </div>
        )}

        {/* Add Location Modal (Doctor) */}
        {showAddLocation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm animate-fade-in">
            <div className="glass-card-elevated rounded-2xl p-6 w-full max-w-md animate-scale-in">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-display font-semibold text-foreground">Add Vet Location</h2>
                <button onClick={() => setShowAddLocation(false)} className="p-1 rounded-lg hover:bg-muted"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-3">
                {[["Clinic Name", "clinic_name"], ["Latitude", "latitude"], ["Longitude", "longitude"], ["Phone", "phone"], ["Address", "address"]].map(([label, key]) => (
                  <div key={key}>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">{label}</label>
                    <input value={(locationForm as any)[key]} onChange={(e) => setLocationForm(f => ({ ...f, [key]: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-xl bg-muted/60 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30" />
                  </div>
                ))}
              </div>
              <button onClick={handleAddLocation} className="w-full mt-5 px-4 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 active:scale-[0.98] transition-all">
                Add Location
              </button>
            </div>
          </div>
        )}

        {/* Appointments List */}
        <div className="glass-card-elevated rounded-2xl p-6 mb-6 animate-reveal-up stagger-1">
          <h2 className="text-lg font-display font-semibold text-foreground mb-5">
            {role === "doctor" ? "Patient Appointments" : "Your Appointments"}
          </h2>
          {loading ? <p className="text-muted-foreground text-sm">Loading...</p> : myAppointments.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">No appointments yet</p>
          ) : (
            <div className="space-y-3">
              {myAppointments.map((apt) => (
                <div key={apt.id} className="flex items-center gap-4 p-4 rounded-xl bg-muted/40 hover:bg-muted/60 transition-all duration-200 group">
                  <div className="w-11 h-11 rounded-xl bg-koda-sage-light flex items-center justify-center text-sm font-bold text-primary">
                    {apt.pet_name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground">
                      {apt.pet_name}
                      {role === "doctor" && <span className="text-muted-foreground font-normal ml-2">— {apt.customer_name}</span>}
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <Stethoscope className="w-3 h-3" /> {apt.visit_type}
                    </p>
                  </div>
                  <div className="text-right shrink-0 flex items-center gap-3">
                    <div>
                      <p className="text-xs font-medium text-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3 text-muted-foreground" /> {apt.appointment_time}
                      </p>
                      <p className="text-xs text-muted-foreground">{apt.appointment_date}</p>
                    </div>
                    <span className={cn("text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full", statusColors[apt.status] || "bg-muted text-muted-foreground")}>
                      {apt.status}
                    </span>
                    {role === "doctor" && apt.status === "pending" && (
                      <button onClick={() => handleAccept(apt.id)} className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 active:scale-95 transition-all">
                        Accept
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
