package org.zerock.mallapi.security.filter;

import com.google.gson.Gson;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;
import org.zerock.mallapi.domain.MemberRole;
import org.zerock.mallapi.dto.MemberDTO;
import org.zerock.mallapi.util.GeneralException;
import org.zerock.mallapi.util.JWTUtil;

import java.io.IOException;
import java.io.PrintWriter;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Log4j2
public class JWTCheckFilter extends OncePerRequestFilter {

  @Override
  protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {

    // Preflight요청은 체크하지 않음 
    if(request.getMethod().equals("OPTIONS")){
      return true;
    }

    String path = request.getRequestURI();

    log.info("check uri..............!!!!!" + path);

    //api/member/ 경로의 호출은 체크하지 않음 
    if(path.startsWith("/api/member/")) {
      log.info("/api/member/ 경로입니다.");
      return true;
    }

    //이미지 조회 경로는 체크하지 않는다면 
    if(path.startsWith("/api/products/view/")) {
      return true;
    }

    //healthcheck
    if(path.startsWith("/api/healthcheck")) {
      return true;
    }

    return false;
  }


  @Override
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
    //인가과정
    log.info("------------------------JWTCheckFilter.......................");


    //request에서 Authorization찾음
    String authHeaderStr = request.getHeader("Authorization");

    log.info("whatdfdfdkfdkf   " + authHeaderStr);

    try {
      //Bearer accestoken...
      String accessToken = authHeaderStr.substring(7);
      Map<String, Object> claims = JWTUtil.validateToken(accessToken); //accessToken 검증 -> 1분으로 했으니 당연히 예외 EXPIRED 뜨겠지?

      log.info("JWT claims: " + claims);

      String email = (String) claims.get("email");
      String password = (String) claims.get("password");
      String nickname = (String) claims.get("nickname");
      Boolean social = (Boolean) claims.get("social");
      List<String> rolesString = (List<String>) claims.get("roleNames");
      List<MemberRole> roleNames = rolesString.stream().map(MemberRole::valueOf).collect(Collectors.toList()); // Stream -> List 변환
      String encryptedId = (String) claims.get("encryptedId");
      LocalDateTime createdAt = (LocalDateTime) claims.get("createdAt");
      LocalDateTime updatedAt = (LocalDateTime) claims.get("updatedAt");

      MemberDTO memberDTO = new MemberDTO(email, password, nickname, social.booleanValue(), roleNames, encryptedId, createdAt, updatedAt);

      log.info("-----------------------------------");
      log.info(memberDTO);
      log.info(memberDTO.getAuthorities());

      UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(memberDTO, password, memberDTO.getAuthorities());

      //SecurityContextHolder에 정보를 저장한다.
      SecurityContextHolder.getContext().setAuthentication(authenticationToken);

      //확인용 -> 지우기
      Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
      log.info("--------authentication : " + authentication);
      log.info("--------principal : " + authentication.getPrincipal());

      filterChain.doFilter(request, response);

    } catch (GeneralException e){//CustomJWTException e

      log.error("JWT Check Error..............");
      log.error(e.getMessage());

      Gson gson = new Gson();
//      String msg = gson.toJson(Map.of("error", "ERROR_ACCESS_TOKEN"));
      String msg = gson.toJson(Map.of("success", false, "code", 401, "message", "ERROR_ACCESS_TOKEN"));

      response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // 상태 코드를 401로 설정
      response.setContentType("application/json; charset=UTF-8");
      PrintWriter printWriter = response.getWriter();
      printWriter.println(msg);
      printWriter.close();

    }
//    catch(Exception e){
//
//      log.error("Error............." + e);
//      log.error(e.getMessage());
//      throw e;
//
//    }
  }



}
