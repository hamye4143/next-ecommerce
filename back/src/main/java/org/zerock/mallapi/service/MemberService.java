package org.zerock.mallapi.service;

import java.util.stream.Collectors;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.transaction.annotation.Transactional;
import org.zerock.mallapi.domain.Member;
import org.zerock.mallapi.dto.MemberDTO;
import org.zerock.mallapi.dto.MemberModifyDTO;
import org.zerock.mallapi.dto.ProductDTO;

@Transactional
public interface MemberService {
  
  MemberDTO getKakaoMember(String accessToken);

  void modifyMember(MemberModifyDTO memberModifyDTO);

  MemberDTO register(MemberDTO memberDTO);

  MemberDTO getProfile(UserDetails userDetails);

  MemberDTO get(String email);

  default MemberDTO entityToDTO(Member member) {

    MemberDTO dto = new MemberDTO(
                                  member.getEmail(),
                                  member.getPassword(),
                                  member.getNickname(),
                                  member.isSocial(),
                                  member.getMemberRoleList().stream().map(memberRole -> memberRole).collect(Collectors.toList()),
                                  member.getEncryptedId()
    );
    return dto;
  }

}
