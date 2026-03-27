import { useState, useEffect } from "react";
import { PageLayout } from "@/components/PageLayout";
import { VetMap } from "@/components/VetMap";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import {
  Stethoscope, MapPin, Clock, CalendarPlus, Map, ChevronRight, X, Check, Plus,
  HeartPulse, XCircle, ClipboardList,
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
  const [showHealthInput, setShowHealthInput] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [vetLocations, setVetLocations] = useState<VetLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingForm, setBookingForm] = useState({ pet: "", date: "", time: "", type: "General Checkup", doctor_id: "" });
  const [locationForm, setLocationForm] = useState({ clinic_name: "", latitude: "", longitude: "", phone: "", address: "" });
  const [healthForm, setHealthForm] = useState({ health_score: "85", weight_kg: "", notes: "" });

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

  const handleAccept = async (apt: Appointment) => {
    await supabase.from("appointments").update({ status: "confirmed", doctor_id: user?.id }).eq("id", apt.id);
    toast({ title: "Appointment Accepted ✅" });
    // Open health input modal
    setSelectedAppointment(apt);
    setHealthForm({ health_score: "85", weight_kg: "", notes: "" });
    setShowHealthInput(true);
    fetchData();
  };

  const handleReject = async (id: string) => {
    await supabase.from("appointments").update({ status: "cancelled" }).eq("id", id);
    toast({ title: "Appointment Rejected ❌" });
    fetchData();
  };

  const handleSubmitHealth = async () => {
    if (!user || !selectedAppointment) return;
    const score = parseInt(healthForm.health_score);
    if (isNaN(score) || score < 0 || score > 100) {
      toast({ title: "Health score must be 0-100", variant: "destructive" }); return;
    }

    // Find the pet by name to get pet_id
    const { data: pets } = await supabase.from("pets").select("id").eq("name", selectedAppointment.pet_name).limit(1);
    const petId = pets?.[0]?.id;

    if (petId) {
      await supabase.from("pet_health_records").insert({
        pet_id: petId,
        health_score: score,
        weight_kg: healthForm.weight_kg ? parseFloat(healthForm.weight_kg) : null,
        notes: healthForm.notes || null,
        recorded_by: user.id,
      });
    }

    // Update appointment notes with health info
    await supabase.from("appointments").update({
      status: "completed",
      notes: `Health Score: ${score}/100${healthForm.weight_kg ? `, Weight: ${healthForm.weight_kg}kg` : ""}${healthForm.notes ? `, Notes: ${healthForm.notes}` : ""}`,
    }).eq("id", selectedAppointment.id);

    toast({ title: "Health record saved! 💚" });
    setShowHealthInput(false);
    setSelectedAppointment(null);
    fetchData();
  };

  const handleOpenHealthInput = (apt: Appointment) => {
    setSelectedAppointment(apt);
    setHealthForm({ health_score: "85", weight_kg: "", notes: "" });
    setShowHealthInput(true);
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
    completed: "bg-koda-sky/10 text-koda-sky",
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

        {/* Health Input Modal (Doctor) */}
        {showHealthInput && selectedAppointment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm animate-fade-in">
            <div className="glass-card-elevated rounded-2xl p-6 w-full max-w-md animate-scale-in">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-display font-semibold text-foreground flex items-center gap-2">
                  <HeartPulse className="w-5 h-5 text-primary" /> Health Assessment
                </h2>
                <button onClick={() => setShowHealthInput(false)} className="p-1 rounded-lg hover:bg-muted"><X className="w-5 h-5" /></button>
              </div>

              <div className="p-3 rounded-xl bg-primary/5 border border-primary/10 mb-4">
                <p className="text-sm font-semibold text-foreground">{selectedAppointment.pet_name}</p>
                <p className="text-xs text-muted-foreground">
                  {selectedAppointment.visit_type} · Patient of {selectedAppointment.customer_name}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Health Score (0-100)</label>
                  <div className="relative">
                    <input
                      type="number" min="0" max="100"
                      value={healthForm.health_score}
                      onChange={(e) => setHealthForm(f => ({ ...f, health_score: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-xl bg-muted/60 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                    />
                    <div className="mt-2 h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-500",
                          parseInt(healthForm.health_score) >= 80 ? "bg-primary" :
                          parseInt(healthForm.health_score) >= 50 ? "bg-koda-warm" : "bg-koda-rose"
                        )}
                        style={{ width: `${Math.min(100, Math.max(0, parseInt(healthForm.health_score) || 0))}%` }}
                      />
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-[10px] text-koda-rose">Critical</span>
                      <span className="text-[10px] text-koda-warm">Fair</span>
                      <span className="text-[10px] text-primary">Excellent</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Weight (kg)</label>
                  <input
                    type="number" step="0.1"
                    value={healthForm.weight_kg}
                    onChange={(e) => setHealthForm(f => ({ ...f, weight_kg: e.target.value }))}
                    placeholder="e.g. 12.5"
                    className="w-full px-3 py-2.5 rounded-xl bg-muted/60 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Clinical Notes</label>
                  <textarea
                    value={healthForm.notes}
                    onChange={(e) => setHealthForm(f => ({ ...f, notes: e.target.value }))}
                    placeholder="Observations, diagnosis, treatment plan..."
                    rows={3}
                    className="w-full px-3 py-2.5 rounded-xl bg-muted/60 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-5">
                <button onClick={handleSubmitHealth}
                  className="flex-1 px-4 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 active:scale-[0.98] transition-all">
                  Save Health Record
                </button>
                <button onClick={() => setShowHealthInput(false)}
                  className="px-4 py-3 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-muted active:scale-[0.98] transition-all">
                  Skip
                </button>
              </div>
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
                      {apt.notes && <span className="ml-2 text-primary">· {apt.notes.slice(0, 40)}...</span>}
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
                      <div className="flex gap-1.5">
                        <button onClick={() => handleAccept(apt)}
                          className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 active:scale-95 transition-all"
                          title="Accept & Record Health">
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleReject(apt.id)}
                          className="px-3 py-1.5 rounded-lg border border-destructive/30 text-destructive text-xs font-medium hover:bg-destructive/10 active:scale-95 transition-all"
                          title="Reject">
                          <XCircle className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                    {role === "doctor" && apt.status === "confirmed" && (
                      <button onClick={() => handleOpenHealthInput(apt)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-koda-sky/10 text-koda-sky text-xs font-medium hover:bg-koda-sky/20 active:scale-95 transition-all"
                        title="Record Health Status">
                        <ClipboardList className="w-3.5 h-3.5" /> Health
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
