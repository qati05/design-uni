-- Tesla-Modell aus der Schadenmeldung (freiwillig, nur bei «Es ist ein Tesla»). Gleiche Liste wie die Website (functions/api/schaden.js).
alter table public.meldungen
  add column tesla_modell text check (tesla_modell is null or tesla_modell in ('Model 3', 'Model Y', 'Model S', 'Model X', 'Anderes Modell')),
  add constraint tesla_modell_nur_bei_tesla check (tesla_modell is null or tesla);
