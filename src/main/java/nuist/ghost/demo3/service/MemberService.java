package nuist.ghost.demo3.service;


import nuist.ghost.demo3.entities.Member;
import nuist.ghost.demo3.repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MemberService {

    @Autowired
    private MemberRepository memberRepository;


    public Member createMember(Member member) {
        /*创建成员*/
        //在创建成员之前，检查是否已经存在相同学号的成员
        if(   memberRepository.existsByStudentID( member.getStudentID() )   ){
            throw new IllegalArgumentException("Member with studentID " + member.getStudentID() + " already exists.");
        }
        return memberRepository.save(member);
    }

    public List<Member> getAllMembers() {
        /*获取所有成员*/
        return memberRepository.findAll();
    }

    public Optional<Member> getMemberByID(Long id){
        /*通过ID获取成员*/
        return memberRepository.findById(id);
    }

    public Optional<Member> getMemberByStudentID(String studentID){
        /*通过学号获取成员*/
        return memberRepository.findByStudentID(studentID);
    }

    public List<Member> getMembersByName(String name){
        /*通过姓名获取成员*/
        return memberRepository.findByName(name);
    }

    public List<Member> getMembersByIsProbation(boolean isProbation){
        /*通过是否为实习期获取成员*/
        return memberRepository.findByIsProbation(isProbation);
    }

    public List<Member> getMembersByInternshipScoreGreaterThan(double score){
        /*通过实习分获取成员*/
        return memberRepository.findByInternshipScoreGreaterThan(score);
    }


    public Member updateMember(Member member){
        /*更新成员*/
        return memberRepository.save(member);
    }

    public void deleteMember(Long id){
        /*删除成员*/
        memberRepository.deleteById(id);
    }
}
