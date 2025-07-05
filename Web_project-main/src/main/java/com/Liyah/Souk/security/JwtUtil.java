// package com.Liyah.Souk.security;

// import io.jsonwebtoken.*;
// import io.jsonwebtoken.security.Keys;
// import org.springframework.stereotype.Component;

// import javax.crypto.SecretKey;
// import java.util.Base64;
// import java.util.Date;

// @Component
// public class JwtUtil {

//     // Replace this Base64 string with your own generated secret key
//     private static final String SECRET_BASE64 = "mZ4g8oD2SsF1jC0ZbLFbUv9O0NeYb1vFk2qJH5CwlLk=";

//     private final SecretKey secretKey = Keys.hmacShaKeyFor(Base64.getDecoder().decode(SECRET_BASE64));

//     private final long expirationTime = 1000 * 60 * 60 * 10; // 10 hours

//     public String generateToken(String username) {
//         return Jwts.builder()
//                 .setSubject(username)
//                 .setIssuedAt(new Date())
//                 .setExpiration(new Date(System.currentTimeMillis() + expirationTime))
//                 .signWith(secretKey, SignatureAlgorithm.HS256)
//                 .compact();
//     }

//     public String extractUsername(String token) {
//         return Jwts.parserBuilder()
//                    .setSigningKey(secretKey)
//                    .build()
//                    .parseClaimsJws(token)
//                    .getBody()
//                    .getSubject();
//     }

//     public boolean validateToken(String token) {
//         try {
//             Jwts.parserBuilder()
//                 .setSigningKey(secretKey)
//                 .build()
//                 .parseClaimsJws(token);
//             return true;
//         } catch (ExpiredJwtException e) {
//             System.out.println("Token expired");
//         } catch (UnsupportedJwtException e) {
//             System.out.println("Unsupported JWT");
//         } catch (MalformedJwtException e) {
//             System.out.println("Malformed JWT");
//         } catch (SignatureException e) {
//             System.out.println("Invalid signature");
//         } catch (IllegalArgumentException e) {
//             System.out.println("Illegal argument token");
//         }
//         return false;
//     }
// }
