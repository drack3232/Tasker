package com.trasker.Tasker.Service;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
@Service
public class JwtService {
   private final String pubKeyStr = "TaskerSuperSecretKeyThatMustBeVeryLongToWorkProperly";
private int jwtExpirationMs = 86400000;
   public String createToken(UserDetails user, String username){
       return Jwts.builder()
               .setSubject(username)
               .setIssuedAt(new Date())
               .setExpiration(new Date(new Date().getTime()+jwtExpirationMs))
               .signWith(getSigningKey(), SignatureAlgorithm.HS256)
               .compact();
   }
    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(pubKeyStr.getBytes());
    }
    public String extractToken(String token){
       return Jwts.parserBuilder()
               .setSigningKey(getSigningKey())
               .build()
               .parseClaimsJws(token)
               .getBody()
               .getSubject();
    }

    public boolean isTokenValid ( String token, UserDetails user){
       final String username = extractToken(token);
       return  (username.equals(user.getUsername()));
    }
}

