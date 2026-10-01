import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Le secret JWT ne doit JAMAIS être codé en dur ni envoyé au frontend : il
// vit uniquement côté serveur, injecté via la variable d'environnement
// JWT_SECRET (voir .env.example). Sans elle, le serveur refuse de démarrer.
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error(
    "JWT_SECRET manquant. Définissez-le dans votre fichier .env (voir .env.example) avant de démarrer le serveur."
  );
}

const TOKEN_TTL = '30d';

export function hashPassword(password) {
  return bcrypt.hash(password, 12);
}

export function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

export function signToken(user) {
  return jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, { expiresIn: TOKEN_TTL });
}

export function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'Authentification requise.' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.userId = payload.sub;
    req.userEmail = payload.email;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Session expirée ou invalide, veuillez vous reconnecter.' });
  }
}
