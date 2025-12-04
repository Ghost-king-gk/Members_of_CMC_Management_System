package nuist.ghost.demo3.entities;




public class RegularMember extends Member {
    public RegularMember() {
        super();
    }

    public RegularMember(String name, String studentID) {
        super(name, studentID);
    }

    @Override
    public String getMemberType() {
        return "RegularMember";
    }
}
