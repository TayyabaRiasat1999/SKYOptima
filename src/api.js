import { supabase } from "./supabaseClient.js";

const BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

// Returns Authorization header with the current Supabase session token, if any.
async function authHeaders(base = {}) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) return base;
    return { ...base, "Authorization": `Bearer ${session.access_token}` };
}

async function apiFetch(path, payload) {
    const res = await fetch(`${BASE}${path}`, {
        method: "POST",
        headers: await authHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify(payload),
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `HTTP ${res.status}`);
    }
    return res.json();
}

async function apiGet(path) {
    const res = await fetch(`${BASE}${path}`, {
        headers: await authHeaders(),
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `HTTP ${res.status}`);
    }
    return res.json();
}

// POST endpoints
export const postOptimize        = (payload)   => apiFetch("/optimize",         payload);
export const postOptimizeAirline = (payload)   => apiFetch("/optimize-airline", payload);
export const postSavePlan        = (payload)   => apiFetch("/save-plan",        payload);

// GET reference endpoints
export const getAirlineProfiles  = ()          => apiGet("/airline-profiles");
export const getAirlineRoutes    = ()          => apiGet("/airline-routes");
export const getFleetDefaults    = (operation) =>
    apiGet(operation ? `/fleet-defaults?operation=${encodeURIComponent(operation)}` : "/fleet-defaults");

export const getSavedPlans = ({ mode, plan_type, limit } = {}) => {
    const params = new URLSearchParams();
    if (mode)      params.set("mode",      mode);
    if (plan_type) params.set("plan_type", plan_type);
    if (limit)     params.set("limit",     String(limit));
    const qs = params.toString();
    return apiGet(qs ? `/saved-plans?${qs}` : "/saved-plans");
};

export const getAudits = (limit = 50) =>
    apiGet(`/audits?limit=${limit}`);

export const getStats = () => apiGet("/stats");
