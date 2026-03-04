import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  MdEventSeat,
  MdOutlinePeople,
  MdOutlineAccessTime,
  MdCheckCircle,
  MdOutlineTableRestaurant,
  MdRefresh,
  MdOutlineDateRange,
  MdAccessTime,
} from "react-icons/md";
import { baseURL } from "../service";

const Dine = ({ adminOnly = false }) => {
  const navigate = useNavigate();
  const { customer } = useSelector((state) => state.customerAuth);
  const { admin } = useSelector((state) => state.adminAuth);

  const isAdmin = Boolean(admin);
  const canManageTables = adminOnly && isAdmin;

  const [tables, setTables] = useState([]);
  const [availableTables, setAvailableTables] = useState([]);
  const [myReservations, setMyReservations] = useState([]);
  const [adminReservations, setAdminReservations] = useState([]);

  const [loadingTables, setLoadingTables] = useState(true);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [makingReservationTableId, setMakingReservationTableId] = useState(null);
  const [statusUpdating, setStatusUpdating] = useState({});
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [selectedGuests, setSelectedGuests] = useState(2);
  const [customGuests, setCustomGuests] = useState("");
  const [reservationDate, setReservationDate] = useState(new Date().toISOString().split("T")[0]);
  const [reservationTime, setReservationTime] = useState("19:30");
  const [specialRequests, setSpecialRequests] = useState("");

  const [newTableForm, setNewTableForm] = useState({
    tableNumber: "",
    seatingCapacity: "4",
    status: "AVAILABLE",
  });

  useEffect(() => {
    if (adminOnly && !isAdmin) {
      navigate("/admin/login");
    }
  }, [adminOnly, isAdmin, navigate]);

  const guestCount = useMemo(() => {
    const parsedCustom = parseInt(customGuests, 10);
    if (!Number.isNaN(parsedCustom) && parsedCustom > 0) return parsedCustom;
    return selectedGuests;
  }, [customGuests, selectedGuests]);

  const tableStats = useMemo(() => {
    const totalCapacity = tables.reduce((sum, table) => sum + Number(table.seatingCapacity || 0), 0);
    const availableCount = tables.filter((table) => (table.status || "").toUpperCase() === "AVAILABLE").length;
    const waitTime = Math.max(5, adminReservations.length * 5);

    return [
      { label: "Available Tables", value: availableCount, icon: MdEventSeat, color: "text-green-500" },
      { label: "Total Capacity", value: totalCapacity, icon: MdOutlinePeople, color: "text-brand" },
      { label: "Estimated Wait", value: `${waitTime}m`, icon: MdOutlineAccessTime, color: "text-accent" },
    ];
  }, [tables, adminReservations]);

  const fetchTables = useCallback(async () => {
    setLoadingTables(true);
    setError("");
    try {
      const res = await axios.get(`${baseURL}/customers/tables`);
      setTables(res.data?.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load tables.");
    } finally {
      setLoadingTables(false);
    }
  }, []);

  const fetchMyReservations = useCallback(async () => {
    if (!customer?.customerId || adminOnly) return;
    try {
      const res = await axios.get(`${baseURL}/customers/${customer.customerId}/reservations`);
      setMyReservations(res.data?.data || []);
    } catch {
      setMyReservations([]);
    }
  }, [customer?.customerId, adminOnly]);

  const fetchAdminReservations = useCallback(async () => {
    if (!canManageTables) {
      setAdminReservations([]);
      return;
    }
    try {
      const res = await axios.get(`${baseURL}/view-tables/admin/reservations`);
      setAdminReservations(res.data?.data || []);
    } catch {
      setAdminReservations([]);
    }
  }, [canManageTables]);

  useEffect(() => {
    fetchTables();
  }, [fetchTables]);

  useEffect(() => {
    fetchMyReservations();
  }, [fetchMyReservations]);

  useEffect(() => {
    fetchAdminReservations();
  }, [fetchAdminReservations]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchTables();
    }, 15000);

    return () => clearInterval(intervalId);
  }, [fetchTables]);

  const checkAvailableTables = useCallback(async () => {
    setCheckingAvailability(true);
    setError("");
    setSuccessMessage("");
    try {
      const res = await axios.get(`${baseURL}/customers/tables/available`, {
        params: {
          date: reservationDate,
          numberOfGuests: guestCount,
          reservationTime,
        },
      });
      setAvailableTables(res.data?.data || []);
      if ((res.data?.data || []).length === 0) {
        setSuccessMessage("No table is currently available for the selected slot.");
      } else {
        setSuccessMessage("Available tables updated.");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to check available tables.");
      setAvailableTables([]);
    } finally {
      setCheckingAvailability(false);
    }
  }, [guestCount, reservationDate, reservationTime]);

  const reserveTable = async (tableId) => {
    if (!customer?.customerId) {
      navigate("/sign-in");
      return;
    }
    setMakingReservationTableId(tableId);
    setError("");
    setSuccessMessage("");
    try {
      await axios.post(`${baseURL}/customers/${customer.customerId}/reservations`, {
        tableId,
        reservationDate,
        reservationTime,
        numberOfGuests: guestCount,
        specialRequests: specialRequests.trim() || null,
      });

      setSuccessMessage("Table reserved successfully.");
      setSpecialRequests("");
      await Promise.all([fetchMyReservations(), fetchAdminReservations(), checkAvailableTables()]);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to reserve table.");
    } finally {
      setMakingReservationTableId(null);
    }
  };

  const createTable = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    try {
      await axios.post(`${baseURL}/view-tables/admin`, {
        tableNumber: Number(newTableForm.tableNumber),
        seatingCapacity: Number(newTableForm.seatingCapacity),
        status: newTableForm.status,
      });

      setSuccessMessage("Table created successfully.");
      setNewTableForm({ tableNumber: "", seatingCapacity: "4", status: "AVAILABLE" });
      await fetchTables();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to create table.");
    }
  };

  const updateTableStatus = async (tableId, status) => {
    setStatusUpdating((prev) => ({ ...prev, [tableId]: true }));
    setError("");
    try {
      await axios.put(`${baseURL}/view-tables/admin/${tableId}/status`, null, {
        params: { status },
      });
      await fetchTables();
      setSuccessMessage("Table status updated.");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update table status.");
    } finally {
      setStatusUpdating((prev) => ({ ...prev, [tableId]: false }));
    }
  };

  const updateReservationStatus = async (reservationId, status) => {
    setError("");
    try {
      await axios.put(`${baseURL}/view-tables/admin/reservations/${reservationId}/status`, null, {
        params: { status },
      });
      setSuccessMessage("Reservation status updated.");
      await Promise.all([fetchAdminReservations(), fetchMyReservations(), checkAvailableTables()]);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update reservation status.");
    }
  };

  if (adminOnly && !isAdmin) {
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto py-10 px-6">
      <div className="text-center mb-12">
        <h1 className="text-5xl mb-4 tracking-tight">
          {adminOnly ? "Admin Dine" : "Reserve Your"} <span className="text-brand">Table</span>
        </h1>
        <p className="text-surface-400 max-w-2xl mx-auto text-lg leading-relaxed">
          {adminOnly
            ? "Create and manage dine-in tables. All created tables are instantly available for customers on the /dine page."
            : "Check available tables by guest count (2/4/8 or custom), reserve instantly, and view live tables created by admin."}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {tableStats.map((stat, idx) => (
          <div
            key={idx}
            className="bg-white p-8 rounded-[2rem] border border-surface-200 shadow-sm flex items-center gap-6"
          >
            <div className={`p-4 rounded-2xl bg-surface-50 ${stat.color}`}>
              <stat.icon className="text-3xl" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-surface-400 mb-1">{stat.label}</p>
              <p className="text-3xl font-black text-surface-950">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {(error || successMessage) && (
        <div className="mb-8 space-y-3">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl font-semibold">{error}</div>}
          {successMessage && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-2xl font-semibold flex items-center gap-2">
              <MdCheckCircle /> {successMessage}
            </div>
          )}
        </div>
      )}

      <div className="bg-white rounded-[2.5rem] border border-surface-200 p-8 mb-10 shadow-sm">
        <h2 className="text-2xl mb-6">Check Available Tables</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
          <div className="lg:col-span-2">
            <label className="text-xs font-black uppercase tracking-widest text-surface-400">Guests</label>
            <div className="flex gap-2 mt-2 flex-wrap">
              {[2, 4, 8].map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => {
                    setSelectedGuests(size);
                    setCustomGuests("");
                  }}
                  className={`px-4 py-2 rounded-xl border font-bold transition ${
                    guestCount === size && customGuests === ""
                      ? "bg-brand text-white border-brand"
                      : "bg-white border-surface-200 hover:border-brand"
                  }`}
                >
                  {size} Person
                </button>
              ))}
              <input
                type="number"
                min="1"
                value={customGuests}
                onChange={(e) => setCustomGuests(e.target.value)}
                placeholder="Custom"
                className="px-3 py-2 rounded-xl border border-surface-200 w-28 focus:outline-none focus:border-brand"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-black uppercase tracking-widest text-surface-400 flex items-center gap-1">
              <MdOutlineDateRange /> Date
            </label>
            <input
              type="date"
              value={reservationDate}
              onChange={(e) => setReservationDate(e.target.value)}
              className="input-field mt-2"
            />
          </div>

          <div>
            <label className="text-xs font-black uppercase tracking-widest text-surface-400 flex items-center gap-1">
              <MdAccessTime /> Time
            </label>
            <input
              type="time"
              value={reservationTime}
              onChange={(e) => setReservationTime(e.target.value)}
              className="input-field mt-2"
            />
          </div>
        </div>

        {!adminOnly && (
          <div className="mb-5">
            <label className="text-xs font-black uppercase tracking-widest text-surface-400">Special Request (optional)</label>
            <textarea
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              placeholder="Birthday setup, wheelchair support, window seat, etc."
              className="w-full mt-2 min-h-[90px] rounded-2xl border border-surface-200 p-3 outline-none focus:border-brand"
            />
          </div>
        )}

        <button
          onClick={checkAvailableTables}
          disabled={checkingAvailability}
          className="btn-primary px-8 py-3"
        >
          {checkingAvailability ? "Checking..." : "Check Available Tables"}
        </button>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl mb-4">Available Tables ({availableTables.length})</h2>
        {availableTables.length === 0 ? (
          <div className="bg-white border border-surface-200 rounded-2xl p-6 text-surface-400">
            Check availability to see matching tables.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableTables.map((table) => (
              <div key={table.tableId} className="bg-white border border-surface-200 rounded-2xl p-5 shadow-sm">
                <p className="text-xs font-black uppercase tracking-widest text-surface-400">Table #{table.tableNumber}</p>
                <p className="text-xl font-black mt-2 flex items-center gap-2">
                  <MdOutlineTableRestaurant className="text-brand" /> {table.seatingCapacity} Seats
                </p>
                <p className="mt-1 text-sm text-surface-500">Status: {(table.status || "AVAILABLE").toUpperCase()}</p>

                {!adminOnly && (
                  <button
                    onClick={() => reserveTable(table.tableId)}
                    disabled={makingReservationTableId === table.tableId}
                    className="mt-4 btn-primary w-full py-2.5"
                  >
                    {makingReservationTableId === table.tableId ? "Reserving..." : "Reserve This Table"}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl">All Tables</h2>
          <button
            onClick={fetchTables}
            className="px-4 py-2 rounded-xl border border-surface-200 hover:border-brand font-bold text-sm flex items-center gap-2"
          >
            <MdRefresh /> Refresh
          </button>
        </div>

        {loadingTables ? (
          <div className="bg-white border border-surface-200 rounded-2xl p-6 text-surface-400">Loading tables...</div>
        ) : tables.length === 0 ? (
          <div className="bg-white border border-surface-200 rounded-2xl p-6 text-surface-400">
            No tables configured yet. {canManageTables ? "Use the admin panel below to create tables." : "Admin can add tables that will appear here."}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tables.map((table) => (
              <div key={table.tableId} className="bg-white border border-surface-200 rounded-2xl p-5">
                <p className="text-xs font-black uppercase tracking-widest text-surface-400">Table #{table.tableNumber}</p>
                <p className="text-lg font-black mt-2">{table.seatingCapacity} Seats</p>
                <p className="text-sm text-surface-500 mt-1">Status: {(table.status || "AVAILABLE").toUpperCase()}</p>

                {canManageTables && (
                  <select
                    className="mt-3 w-full rounded-xl border border-surface-200 p-2 outline-none focus:border-brand"
                    value={(table.status || "AVAILABLE").toUpperCase()}
                    onChange={(e) => updateTableStatus(table.tableId, e.target.value)}
                    disabled={statusUpdating[table.tableId]}
                  >
                    <option value="AVAILABLE">AVAILABLE</option>
                    <option value="OCCUPIED">OCCUPIED</option>
                    <option value="MAINTENANCE">MAINTENANCE</option>
                  </select>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {!adminOnly && customer?.customerId && (
        <div className="mb-12 bg-white rounded-[2.5rem] border border-surface-200 p-8 shadow-sm">
          <h2 className="text-2xl mb-4">My Reservations</h2>
          {myReservations.length === 0 ? (
            <p className="text-surface-400">You have no reservations yet.</p>
          ) : (
            <div className="space-y-3">
              {myReservations.map((reservation) => (
                <div key={reservation.reservationId} className="border border-surface-200 rounded-2xl p-4">
                  <p className="font-black">
                    Reservation #{reservation.reservationId} • Table #{reservation.sitting_table?.tableNumber || "N/A"}
                  </p>
                  <p className="text-sm text-surface-500 mt-1">
                    {reservation.reservationDate} • {reservation.reservationTime} • {reservation.numberOfGuests || 0} Guests
                  </p>
                  <p className="text-sm mt-1">
                    Status: <span className="font-bold">{reservation.reservationStatus || "CONFIRMED"}</span>
                  </p>
                  {reservation.specialRequests && (
                    <p className="text-sm mt-1 text-surface-500">Request: {reservation.specialRequests}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {canManageTables && (
        <div className="bg-surface-950 rounded-[2.5rem] p-8 text-white">
          <h2 className="text-3xl mb-6">Admin Table Management</h2>

          <form onSubmit={createTable} className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-8">
            <input
              type="number"
              min="1"
              placeholder="Table Number"
              value={newTableForm.tableNumber}
              onChange={(e) => setNewTableForm((prev) => ({ ...prev, tableNumber: e.target.value }))}
              className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 outline-none focus:border-brand"
              required
            />
            <input
              type="number"
              min="1"
              placeholder="Seating Capacity"
              value={newTableForm.seatingCapacity}
              onChange={(e) => setNewTableForm((prev) => ({ ...prev, seatingCapacity: e.target.value }))}
              className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 outline-none focus:border-brand"
              required
            />
            <select
              value={newTableForm.status}
              onChange={(e) => setNewTableForm((prev) => ({ ...prev, status: e.target.value }))}
              className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 outline-none focus:border-brand"
            >
              <option value="AVAILABLE">AVAILABLE</option>
              <option value="OCCUPIED">OCCUPIED</option>
              <option value="MAINTENANCE">MAINTENANCE</option>
            </select>
            <button type="submit" className="btn-primary py-2.5">Create Table</button>
          </form>

          <h3 className="text-xl mb-4">All Reservations (Admin View)</h3>
          {adminReservations.length === 0 ? (
            <p className="text-surface-300">No reservations yet.</p>
          ) : (
            <div className="space-y-3 max-h-[420px] overflow-auto pr-2">
              {adminReservations.map((reservation) => (
                <div key={reservation.reservationId} className="bg-white/10 border border-white/10 rounded-2xl p-4">
                  <p className="font-black">
                    #{reservation.reservationId} • Table #{reservation.tableNumber || "N/A"} • {reservation.numberOfGuests || 0} Guests
                  </p>
                  <p className="text-sm text-surface-200 mt-1">
                    {reservation.reservationDate} • {reservation.reservationTime} • {reservation.customerName || "Unknown Customer"}
                  </p>
                  <p className="text-sm text-surface-300 mt-1">
                    {reservation.customerEmail || "N/A"} • {reservation.customerContact || "N/A"}
                  </p>
                  {reservation.specialRequests && (
                    <p className="text-sm text-surface-200 mt-1">Request: {reservation.specialRequests}</p>
                  )}
                  <div className="mt-3">
                    <select
                      value={(reservation.reservationStatus || "CONFIRMED").toUpperCase()}
                      onChange={(e) => updateReservationStatus(reservation.reservationId, e.target.value)}
                      className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 outline-none focus:border-brand"
                    >
                      <option value="CONFIRMED">CONFIRMED</option>
                      <option value="CANCELLED">CANCELLED</option>
                      <option value="COMPLETED">COMPLETED</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dine;
