import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabaseClient";

export function useEntries(enabled) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saveError, setSaveError] = useState(false);

  const fetchEntries = useCallback(async () => {
    const { data, error } = await supabase.from("entries").select("*").order("date", { ascending: true });
    if (error) {
      setSaveError(true);
      return;
    }
    setSaveError(false);
    setEntries(data || []);
  }, []);

  useEffect(() => {
    if (!enabled) {
      setEntries([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    fetchEntries().finally(() => setLoading(false));

    // Mantém a lista atualizada em tempo real quando alguém da equipe lança ou apaga algo.
    const channel = supabase
      .channel("entries-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "entries" }, () => {
        fetchEntries();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [enabled, fetchEntries]);

  const addEntry = useCallback(
    async ({ date, entrada, saida, nota }) => {
      const { error } = await supabase.from("entries").insert([{ date, entrada, saida, nota: (nota || "").trim() }]);
      if (error) {
        setSaveError(true);
        return;
      }
      setSaveError(false);
      fetchEntries();
    },
    [fetchEntries]
  );

  const removeEntry = useCallback(
    async (id) => {
      const { error } = await supabase.from("entries").delete().eq("id", id);
      if (error) {
        setSaveError(true);
        return;
      }
      setSaveError(false);
      fetchEntries();
    },
    [fetchEntries]
  );

  return { entries, loading, saveError, addEntry, removeEntry };
}
