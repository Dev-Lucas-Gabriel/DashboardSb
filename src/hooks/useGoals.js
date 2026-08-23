import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabaseClient";

export function useGoals(enabled) {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saveError, setSaveError] = useState(false);

  const fetchGoals = useCallback(async () => {
    const { data, error } = await supabase.from("goals").select("*").order("created_at", { ascending: true });
    if (error) {
      setSaveError(true);
      return;
    }
    setSaveError(false);
    setGoals(data || []);
  }, []);

  useEffect(() => {
    if (!enabled) {
      setGoals([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    fetchGoals().finally(() => setLoading(false));

    const channel = supabase
      .channel("goals-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "goals" }, () => {
        fetchGoals();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [enabled, fetchGoals]);

  const addGoal = useCallback(
    async ({ tipo, titulo, valor_alvo, mes, prazo }) => {
      const { error } = await supabase
        .from("goals")
        .insert([{ tipo, titulo: (titulo || "").trim(), valor_alvo, mes: mes || null, prazo: prazo || null }]);
      if (error) {
        setSaveError(true);
        return;
      }
      setSaveError(false);
      fetchGoals();
    },
    [fetchGoals]
  );

  const addProgress = useCallback(
    async (id, amount) => {
      const goal = goals.find((g) => g.id === id);
      if (!goal) return;
      const novoValor = Number(goal.valor_atual) + Number(amount);
      const { error } = await supabase.from("goals").update({ valor_atual: novoValor }).eq("id", id);
      if (error) {
        setSaveError(true);
        return;
      }
      setSaveError(false);
      fetchGoals();
    },
    [goals, fetchGoals]
  );

  const updateGoal = useCallback(
    async (id, { titulo, valor_alvo, mes, prazo }) => {
      const { error } = await supabase
        .from("goals")
        .update({ titulo: (titulo || "").trim(), valor_alvo, mes: mes || null, prazo: prazo || null })
        .eq("id", id);
      if (error) {
        setSaveError(true);
        return;
      }
      setSaveError(false);
      fetchGoals();
    },
    [fetchGoals]
  );

  const setProgress = useCallback(
    async (id, novoValor) => {
      const { error } = await supabase.from("goals").update({ valor_atual: Number(novoValor) }).eq("id", id);
      if (error) {
        setSaveError(true);
        return;
      }
      setSaveError(false);
      fetchGoals();
    },
    [fetchGoals]
  );

  const removeGoal = useCallback(
    async (id) => {
      const { error } = await supabase.from("goals").delete().eq("id", id);
      if (error) {
        setSaveError(true);
        return;
      }
      setSaveError(false);
      fetchGoals();
    },
    [fetchGoals]
  );

  return { goals, loading, saveError, addGoal, updateGoal, addProgress, setProgress, removeGoal };
}
