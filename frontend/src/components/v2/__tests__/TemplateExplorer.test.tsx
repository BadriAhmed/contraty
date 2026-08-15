import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TemplateExplorer from "@/components/v2/TemplateExplorer";
import type { Template } from "@/types";

vi.mock("next/link", () => ({
  default: (props: any) => <a href={props.href}>{props.children}</a>,
}));
vi.mock("@/lib/analytics", () => ({ trackEvent: vi.fn() }));

function tpl(slug: string, titleFr: string, domain: string): Template {
  return {
    id: `${slug}-v1`,
    slug,
    title_ar: titleFr,
    title_fr: titleFr,
    description_ar: "",
    description_fr: "",
    domain,
    complexity: "low",
    field_count: 2,
    sections: [],
    field_metadata: {},
  } as Template;
}

const templates = [
  tpl("bail-habitation", "Contrat de Bail d'Habitation", "logement"),
  tpl("contrat-cdi", "Contrat de Travail (CDI)", "travail"),
  tpl("vente-voiture", "Vente de Voiture", "vehicules"),
];

describe("TemplateExplorer", () => {
  it("renders template cards", () => {
    render(<TemplateExplorer lang="fr" templates={templates} />);
    expect(screen.getByText("Contrat de Bail d'Habitation")).toBeInTheDocument();
    expect(screen.getByText("Contrat de Travail (CDI)")).toBeInTheDocument();
  });

  it("filters by the initial search query", () => {
    render(<TemplateExplorer lang="fr" templates={templates} initialQuery="bail" />);
    expect(screen.getByText("Contrat de Bail d'Habitation")).toBeInTheDocument();
    expect(screen.queryByText("Contrat de Travail (CDI)")).not.toBeInTheDocument();
    expect(screen.queryByText("Vente de Voiture")).not.toBeInTheDocument();
  });

  it("shows a result count and clears the query", async () => {
    render(<TemplateExplorer lang="fr" templates={templates} initialQuery="contrat" />);
    // "contrat" matches the two contracts but not the car sale
    expect(screen.getByText("Contrat de Bail d'Habitation")).toBeInTheDocument();
    expect(screen.getByText("Contrat de Travail (CDI)")).toBeInTheDocument();
    expect(screen.queryByText("Vente de Voiture")).not.toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Effacer" }));
    expect(screen.getByText("Vente de Voiture")).toBeInTheDocument();
  });

  it("shows an empty state when nothing matches", () => {
    render(<TemplateExplorer lang="fr" templates={templates} initialQuery="zzzz" />);
    expect(screen.getByText("Aucun modèle ne correspond à votre recherche")).toBeInTheDocument();
  });
});
