/* ILUZTAR Motion Reel — data source (ILUZTAR PHP + MySQL; replaces the old Supabase project).
   api:   reel data (media slots, contacts, profile, Instagram numbers) — read-only, public
   admin: where the person button / "?admin" leads (Admin › Motion Reel, login required)
   Paths are relative to this folder: dev/motion/ → the site root is ../../ */
window.ILUZTAR_MOTION = {
  // GitHub Pages tidak punya API ILUZTAR: reel memakai isi bawaan (tanpa permintaan yang pasti 404)
  api: location.hostname.endsWith('github.io') ? '' : '../../api/motion.php',
  admin: '../../admin/motion/',
};
