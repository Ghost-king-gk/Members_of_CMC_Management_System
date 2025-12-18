package nuist.ghost.demo3.repository;
/**
 * Store Member Info 储存成员信息
 * @author   Kai Cai 蔡凯
 */

import nuist.ghost.demo3.entities.Member;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.stream.Collectors;


@Repository
public class MemberRepository {

    private final CopyOnWriteArrayList<Member> store = new CopyOnWriteArrayList<>();
    private long nextAvailableId() {
        /*Get the minimum Available ID*/
        java.util.HashSet<Long> used = new java.util.HashSet<>();
        for (Member m : store) {
            if (m.getId() != null && m.getId() >= 0) 
                used.add(m.getId());
        }
        long id = 0;
        while (used.contains(id)) id++;
        return id;
    } 

    public List<Member> findAll() {
        return store.stream().collect(Collectors.toList());
    }

    public Optional<Member> findById(long id) {
        return store.stream().filter(m -> m.getId() != null && m.getId() == id).findFirst();
    }

    public Optional<Member> findByStudentID(String studentID) {
        return store.stream().filter(m -> m.getStudentID().equals(studentID)).findFirst();
    }

    public Member save(Member m) {
        if (m.getId() == null) {
            long id = nextAvailableId();
            m.setId(id);
        } else {
            // 如果已有 id，先删除旧的（更新语义）
            deleteById(m.getId());
        }
        store.add(m);
        return m;
    }

    public int count() {
        return Integer.parseInt(String.valueOf(store.size()));
    }

    public boolean existsByStudentID(String studentID) {
        return store.stream().anyMatch(m -> m.getStudentID().equals(studentID));
    }

    public boolean existsById(Long id) {
        return store.stream().anyMatch(m -> m.getId() != null && m.getId().equals(id));
    }

    public List<Member> findByName(String name) {
        return store.stream().filter(m -> m.getName().equals(name)).collect(Collectors.toList());
    }

    public List<Member> findByIsProbation(boolean isProbation) {
        return store.stream().filter(m -> m.isProbation() == isProbation).collect(Collectors.toList());
    }

    public List<Member> findByInternshipScoreGreaterThan(double score) {
        return store.stream().filter(m -> m.getInternshipScore() > score).collect(Collectors.toList());
    }

    public List<Member> findByMemberType(String position) {
        return store.stream().filter(m -> m.getMemberType().equals(position)).collect(Collectors.toList());
    }

    public void deleteById(Long id) {
        store.removeIf(m -> m.getId() != null && m.getId().equals(id));
    }

    public void saveAll(List<Member> members) {
        for (Member m : members) {
            save(m);
        }
    }

    public void deleteAll() {
        store.clear();
    }


}
