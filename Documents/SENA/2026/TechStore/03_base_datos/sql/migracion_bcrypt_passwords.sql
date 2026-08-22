-- Migra password_demo de texto plano a hash BCrypt.
-- Todos los usuarios seed usaban '12345'; este es su hash bcrypt equivalente.
USE techstore_sql_real;

UPDATE usuarios
SET password_demo = '$2a$10$jNj9nfoLV/YEtXZPSm7MuuZG1YCt5YUCoth6liYK5wUolSvBoIX9u'
WHERE password_demo = '12345';
