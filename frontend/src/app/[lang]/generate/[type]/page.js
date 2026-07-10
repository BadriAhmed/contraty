"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { getMessages } from "@/lib/i18n";
import { fetchTemplate } from "@/lib/constants";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, CheckCircle2 } from "lucide-react";

export default function GeneratePage() {
  const params = useParams();
  const { lang, type } = params;
  const msg = getMessages(lang);

  const [template, setTemplate] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [fieldValues, setFieldValues] = useState({});
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  const [generatedContract, setGeneratedContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTemplate(type)
      .then((t) => {
        setTemplate(t);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, [type]);

  const collectFields = useCallback(() => {
    if (!template) return [];
    const allFields = [];
    const seen = new Set();
    for (const section of template.sections || []) {
      for (const article of section.articles || []) {
        for (const field of article.fields || []) {
          if (!seen.has(field)) {
            seen.add(field);
            allFields.push({ name: field, label: field.replace(/_/g, " ").replace(/\[|\]/g, "") });
          }
        }
      }
    }
    return allFields;
  }, [template]);

  const fieldsPerStep = 5;
  const allFields = collectFields();
  const totalSteps = Math.ceil((allFields.length + fieldsPerStep - 1) / fieldsPerStep) + 1;
  const isDisclaimerStep = currentStep >= totalSteps - 1;

  const currentFields = isDisclaimerStep
    ? []
    : allFields.slice(currentStep * fieldsPerStep, (currentStep + 1) * fieldsPerStep);

  const handleFieldChange = (name, value) => {
    setFieldValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (isDisclaimerStep) {
      handleGenerate();
      return;
    }
    setCurrentStep((s) => s + 1);
  };

  const handlePrevious = () => {
    setCurrentStep((s) => Math.max(0, s - 1));
    setGeneratedContract(null);
  };

  const handleGenerate = async () => {
    if (!disclaimerAccepted) {
      setError(msg.wizard?.disclaimerRequired || "Vous devez accepter l'avertissement légal");
      return;
    }
    setGenerating(true);
    setError(null);

    try {
      const res = await fetch(`http://localhost:8000/api/v1/contracts/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contract_slug: type,
          language: lang,
          user_fields: fieldValues,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Generation failed");
      }

      const data = await res.json();
      setGeneratedContract(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setGenerating(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!generatedContract?.contract) return;
    try {
      const res = await fetch(`http://localhost:8000/api/v1/contracts/generate/pdf`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contract_slug: type,
          language: lang,
          contract_json: generatedContract.contract,
        }),
      });
      if (!res.ok) throw new Error("PDF generation failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${type}-${lang}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      setError(e.message);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error && !template) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-destructive">
          {lang === "ar" ? "خطأ" : "Erreur"}
        </h1>
        <p className="text-muted-foreground mt-2">{error}</p>
      </div>
    );
  }

  const title = lang === "ar" ? template?.title_ar : template?.title_fr;

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold text-primary mb-2">
        {msg.wizard?.title}: {title}
      </h1>
      <p className="text-muted-foreground mb-6">
        {msg.wizard?.step?.replace("{current}", currentStep + 1).replace("{total}", totalSteps)}
      </p>

      <Card>
        <CardContent className="pt-6">
          {generatedContract ? (
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle2 className="h-5 w-5" />
                <span className="font-medium">
                  {lang === "ar" ? "تم إنشاء العقد بنجاح!" : "Contrat généré avec succès!"}
                </span>
              </div>

              {generatedContract.model_used && (
                <p className="text-sm text-muted-foreground">
                  {msg.contract?.modelUsed}: {generatedContract.model_used}
                  {generatedContract.fallback_attempted && " (fallback)"}
                </p>
              )}

              <div className="rounded-lg bg-muted p-4 max-h-96 overflow-y-auto">
                <pre className="text-xs whitespace-pre-wrap font-mono">
                  {JSON.stringify(generatedContract.contract, null, 2)}
                </pre>
              </div>

              <div className="flex gap-4">
                <Button variant="outline" onClick={handlePrevious}>
                  {msg.wizard?.back}
                </Button>
                <Button onClick={handleDownloadPdf}>
                  {msg.wizard?.downloadPdf}
                </Button>
              </div>
            </div>
          ) : isDisclaimerStep ? (
            <div className="space-y-6">
              <div className="rounded-lg border-2 border-destructive/30 bg-destructive/5 p-4">
                <p className="text-sm text-destructive font-bold leading-relaxed">
                  {msg.site?.disclaimer}
                </p>
              </div>

              <div className="flex items-start gap-3">
                <Checkbox
                  id="disclaimer"
                  checked={disclaimerAccepted}
                  onChange={(e) => setDisclaimerAccepted(e.target.checked)}
                />
                <Label htmlFor="disclaimer" className="text-sm cursor-pointer">
                  {msg.site?.disclaimerCheckbox}
                </Label>
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <div className="flex gap-4">
                <Button variant="outline" onClick={handlePrevious} disabled={generating}>
                  {msg.wizard?.back}
                </Button>
                <Button onClick={handleGenerate} disabled={generating}>
                  {generating && <Loader2 className="me-2 h-4 w-4 animate-spin" />}
                  {msg.wizard?.generate}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {currentFields.map((field) => (
                <div key={field.name} className="space-y-2">
                  <Label htmlFor={field.name}>{field.label}</Label>
                  <Input
                    id={field.name}
                    value={fieldValues[field.name] || ""}
                    onChange={(e) => handleFieldChange(field.name, e.target.value)}
                    placeholder={field.label}
                  />
                </div>
              ))}

              <div className="flex gap-4">
                {currentStep > 0 && (
                  <Button variant="outline" onClick={handlePrevious}>
                    {msg.wizard?.back}
                  </Button>
                )}
                <Button onClick={handleNext}>
                  {currentStep < totalSteps - 1 ? msg.wizard?.next : msg.wizard?.generate}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
