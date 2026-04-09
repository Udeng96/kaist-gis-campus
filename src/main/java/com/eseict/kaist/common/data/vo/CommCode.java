package com.eseict.kaist.common.data.vo;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@Entity
@Table(name = "comm_code", schema = "public")
@NoArgsConstructor
@AllArgsConstructor
public class CommCode {

    @Id
    @Column(name = "code")
    private String code;

    @Column(name = "name")
    private String name;

    @Column(name = "type")
    private String type;
}
