/* Cloud saves for the installed app (GitHub Pages).
   Paste your Supabase project's URL and "anon public" key here to turn on
   synchronised saves on every device without typing them in the app.
   The anon key is meant to be public: the database rules in
   supabase/schema.sql let each person read and write only their own saves.
   Leave both empty to configure them from the Saves page instead. */
window.Carto = window.Carto || {};
window.Carto.Config = {
  supabaseUrl: '',
  supabaseKey: '',
};
