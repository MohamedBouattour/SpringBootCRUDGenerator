import { Component, OnInit } from '@angular/core';
import { saveAs } from 'file-saver';
import { FormGroup, FormBuilder,Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

	i:number=0;
	class:any={name:""};
	attr:any={name:"",type:""};
	attrs=[];
	ch:string="";
	package:string="org.com";
  isChecked:boolean=false;
  titleAlert:string="This field is required";

  classForm: FormGroup;
  attForm: FormGroup;
  constructor(private fb:FormBuilder) {
    this.classForm = fb.group({
      'className':["", Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(15)])],
      'packageName':["org.com", Validators.compose([Validators.required, Validators.minLength(7), Validators.maxLength(10)])],
    });

    this.attForm = fb.group({
      'attName':["", Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(10)])],
      'attType':["", Validators.required],
    })
   }
   
  ngOnInit() {

  }
  addAttr(attr) {
  	this.attrs.push(attr);
  	//this.attr={name:"",type:""};
  	this.i++;
  }
  generate(cl) {
    console.log(cl);
      this.forEntity(cl);
      this.forDAO(cl);
      this.forService(cl);
  }

  forEntity(cl) {
    this.ch+="package "+cl.packageName+".entity ;\n\n\n";
    this.ch+="import java.io.Serializable; \n";
    this.ch+="import javax.persistence.Entity; \n";
    this.ch+="import javax.persistence.GeneratedValue; \n";
    this.ch+="import javax.persistence.GenerationType; \n";
    this.ch+="import javax.persistence.Id;\n";
    this.ch+="@Entity \npublic class "+cl.className+" implements Serializable { \n";
    this.ch+="@Id\n@GeneratedValue(strategy = GenerationType.AUTO) \n  private Integer id; \n";
    for (var i =0; i<= this.attrs.length - 1; i++) {
      this.ch+="  private "+this.attrs[i].attType+" "+this.attrs[i].attName+";\n";
    }
    this.ch+="public "+cl.className+" (";
    this.ch+="Integer id";
      for (var i =0; i<= this.attrs.length - 1; i++) {
      this.ch+=", "+this.attrs[i].attType+" "+this.attrs[i].attName;
    }
    this.ch+=")\n{\n";
  this.ch+="  this.id = id;\n";
  for (var i =0; i<= this.attrs.length - 1; i++) {
      this.ch+="  this."+this.attrs[i].attName+"="+this.attrs[i].attName+";\n";
    }
    this.ch+="}\npublic "+cl.className+"(){}\n";
    this.ch+="public Integer getId() {return id;}\npublic void setId(Integer id) {  this.id = id;}\n";
    for (var i =0; i<= this.attrs.length - 1; i++) {
      this.ch+="public "+this.attrs[i].attType+" get"+this.capitalise(this.attrs[i].attName)+"(){ return "+this.attrs[i].attName+"}\n";
      this.ch+="public void set"+this.capitalise(this.attrs[i].attName)+"("+this.attrs[i].attType+" "+this.attrs[i].attName+"){this."+this.attrs[i].attName+"="+this.attrs[i].attName+";}\n";
    }
    this.ch+="\n}";
    saveAs(new Blob([this.ch], { type: "java" }), this.capitalise(cl.className)+'.java');
  }

  forDAO(cl) {
    this.ch='';
    this.ch+="package "+cl.packageName+".dao ;\n\n\n";
    this.ch+=`import `+cl.packageName+`.entity.`+this.capitalise(cl.className)+`;
import org.springframework.data.jpa.repository.JpaRepository;
`;
    if(this.isChecked){
      this.ch+=`import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
`
    }
    this.ch+=`public interface `+this.capitalise(cl.className)+`Reository extends JpaRepository<`+this.capitalise(cl.className)+`,Integer> {
      `;
    if(this.isChecked){
      this.ch+=`@Query("select u from `+this.capitalise(cl.className)+` u where u.mail like :m and u.pass like :p")
  public `+this.capitalise(cl.className)+` Authentify (@Param("mail") String p1,@Param("pass") String p2);
  `
    }
    this.ch+="}";
    saveAs(new Blob([this.ch], { type: "java" }), this.capitalise(cl.className)+'Repository.java');
  }


  forService(cl) {
    this.ch="";
    this.ch+=`package `+cl.packageName+`.service;

import java.util.List;
import java.util.Optional;

import `+cl.packageName+`.`+this.capitalise(cl.className)+`Repository;
import `+cl.packageName+`.entity.`+this.capitalise(cl.className)+`;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class `+this.capitalise(cl.className)+`Service {
  
  @Autowired
  private `+this.capitalise(cl.className)+`Repository `+cl.className+`Rep;
  
  @RequestMapping(value="/`+cl.className+`/get",method=RequestMethod.GET)
  public List<`+this.capitalise(cl.className)+`> get`+this.capitalise(cl.className)+`() {
    return `+cl.className+`Rep.findAll();
  }
  @RequestMapping(value="/`+cl.className+`/get/{id}",method=RequestMethod.GET)
  public Optional<`+this.capitalise(cl.className)+`> get`+this.capitalise(cl.className)+`(@PathVariable Integer id) {
    return `+cl.className+`Rep.findById(id);
  }
  @RequestMapping(value="/`+cl.className+`/add",method=RequestMethod.POST)
  public `+this.capitalise(cl.className)+` save(@RequestBody `+this.capitalise(cl.className)+` m) {
    return `+cl.className+`Rep.save(m);
  }
  @RequestMapping(value="/`+cl.className+`/delete/{id}",method=RequestMethod.DELETE)
  public boolean delete(@PathVariable Integer id) {
    `+cl.className+`Rep.deleteById(id);
    return true;
  }
  @RequestMapping(value="/`+cl.className+`/update",method=RequestMethod.POST)
  public boolean update(@RequestBody `+this.capitalise(cl.className)+` m) {
    `+cl.className+`Rep.save(m);
      return true;
  }
  `;
  if(this.isChecked){
    this.ch+=`@RequestMapping(value="/`+cl.className+`/login",method=RequestMethod.POST)
  public `+this.capitalise(cl.className)+` login(@RequestBody `+this.capitalise(cl.className)+` u) {
    return `+cl.className+`Rep.Authentify(u.getMail(), u.getPass());   
  }
  `
  }
  this.ch+='}';
  saveAs(new Blob([this.ch], { type: "java" }), this.capitalise(cl.className)+'Service.java');
  }

  capitalise(x:string) {
  	return x.charAt(0).toUpperCase() + x.slice(1);
  }
}
