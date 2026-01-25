package coldblooded.project.prototype.security;

import coldblooded.project.prototype.entity.User;
import coldblooded.project.prototype.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private UserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        jwt = authHeader.substring(7);
        try {
            userEmail = jwtTokenProvider.extractUsername(jwt);
            if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {

                User user = userRepository.findByEmail(userEmail).orElse(null);

                if (user != null && jwtTokenProvider.validateToken(jwt, userEmail)) {
                    SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + user.getRole().name());

                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            user, // Principal
                            null,
                            Collections.singletonList(authority));
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        } catch (Exception e) {
            // Token invalid or expired
        }

        filterChain.doFilter(request, response);
    }
}
