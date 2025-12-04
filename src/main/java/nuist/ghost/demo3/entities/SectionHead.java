package nuist.ghost.demo3.entities;



public class SectionHead extends Member{
    public SectionHead() {

    }

    public SectionHead(String name, String studentID) {
        super(name, studentID);
    }

    @Override
    public String getMemberType() {
        return "SectionHead";
    }
}
