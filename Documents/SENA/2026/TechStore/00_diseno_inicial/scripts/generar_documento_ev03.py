from pathlib import Path

from docx import Document
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Cm, Pt


BASE_DIR = Path(r"C:\Users\mateo\Documents\SENA\2026")
OUTPUT_DIR = BASE_DIR / "Evidencia GA6-220501096-AA1-EV02. Modelo entidad relación de caso"
OUTPUT_FILE = OUTPUT_DIR / "GA6-220501096-AA1-EV03 - Creación de los objetos de la base de datos (TechStore).docx"


def set_page_margins(document: Document) -> None:
    section = document.sections[0]
    section.top_margin = Cm(2.54)
    section.bottom_margin = Cm(2.54)
    section.left_margin = Cm(2.54)
    section.right_margin = Cm(2.54)


def add_title(document: Document, text: str) -> None:
    paragraph = document.add_paragraph(text)
    paragraph.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = paragraph.runs[0]
    run.bold = True
    run.font.size = Pt(16)


def add_subtitle(document: Document, text: str) -> None:
    paragraph = document.add_paragraph(text)
    paragraph.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = paragraph.runs[0]
    run.font.size = Pt(12)


def add_heading(document: Document, text: str, level: int = 1) -> None:
    heading = document.add_heading(text, level=level)
    heading.alignment = WD_ALIGN_PARAGRAPH.LEFT


def add_body(document: Document, text: str) -> None:
    paragraph = document.add_paragraph(text)
    paragraph_format = paragraph.paragraph_format
    paragraph_format.space_after = Pt(8)
    paragraph_format.line_spacing = 1.4


def add_code_block(document: Document, code: str) -> None:
    paragraph = document.add_paragraph()
    paragraph_format = paragraph.paragraph_format
    paragraph_format.space_before = Pt(4)
    paragraph_format.space_after = Pt(8)
    for idx, line in enumerate(code.strip("\n").splitlines()):
        run = paragraph.add_run(line)
        run.font.name = "Consolas"
        run._element.rPr.rFonts.set(qn("w:eastAsia"), "Consolas")
        run.font.size = Pt(10)
        if idx < len(code.strip("\n").splitlines()) - 1:
            paragraph.add_run("\n")


def set_cell_vertical_center(cell) -> None:
    tc = cell._tc
    tc_pr = tc.get_or_add_tcPr()
    v_align = OxmlElement("w:vAlign")
    v_align.set(qn("w:val"), "center")
    tc_pr.append(v_align)


def add_capture_placeholder(document: Document, title: str, hint: str) -> None:
    document.add_paragraph(f"{title}:", style="List Bullet")
    table = document.add_table(rows=1, cols=1)
    table.style = "Table Grid"
    cell = table.cell(0, 0)
    cell.text = f"PEGAR CAPTURA AQUÍ\n{hint}"
    set_cell_vertical_center(cell)
    paragraph = cell.paragraphs[0]
    paragraph.alignment = WD_ALIGN_PARAGRAPH.CENTER
    for run in paragraph.runs:
        run.bold = True
        run.font.size = Pt(11)

    row = table.rows[0]
    tr = row._tr
    tr_pr = tr.get_or_add_trPr()
    tr_height = OxmlElement("w:trHeight")
    tr_height.set(qn("w:val"), "2800")
    tr_pr.append(tr_height)
    document.add_paragraph("")


def add_cover_page(document: Document) -> None:
    for _ in range(4):
        document.add_paragraph("")

    add_title(document, "SERVICIO NACIONAL DE APRENDIZAJE - SENA")
    add_subtitle(document, "Análisis y Desarrollo de Software")
    add_subtitle(document, "Evidencia GA6-220501096-AA1-EV03")

    document.add_paragraph("")
    add_title(document, "CREACIÓN DE LOS OBJETOS DE LA BASE DE DATOS")
    add_subtitle(document, "Proyecto: TechStore")

    for _ in range(6):
        document.add_paragraph("")

    add_subtitle(document, "Aprendiz: Mateo Cárdenas")
    add_subtitle(document, "Instructor(a): ______________________________")
    add_subtitle(document, "Ficha: ______________________________")
    add_subtitle(document, "Centro de formación: ______________________________")
    add_subtitle(document, "Fecha: ______________________________")
    add_subtitle(document, "Ciudad: ______________________________")

    document.add_page_break()


def add_intro_and_objectives(document: Document) -> None:
    add_heading(document, "Introducción", level=1)
    add_body(
        document,
        "Este documento presenta la creación de los objetos de una base de datos NoSQL para el proyecto "
        "TechStore, en coherencia con los módulos implementados en la interfaz web: clientes, empleados, "
        "proveedores, productos, ventas, detalle de venta e inventario. Se evidencian las sentencias ejecutadas "
        "en MongoDB, junto con la inserción de datos, consultas y actualización de registros."
    )

    add_heading(document, "Objetivo General", level=1)
    add_body(
        document,
        "Construir y validar una base de datos NoSQL para TechStore, mediante sentencias de creación de "
        "colecciones, inserción de documentos, consultas y actualización de datos."
    )

    add_heading(document, "Objetivos Específicos", level=1)
    for item in [
        "Crear la base de datos techstore_db en MongoDB.",
        "Definir las colecciones principales del modelo de datos TechStore.",
        "Insertar cinco documentos por colección con estructura JSON coherente.",
        "Consultar los datos insertados para validar integridad.",
        "Actualizar el primer y último registro de cada colección.",
        "Documentar la evidencia con capturas de pantalla del proceso."
    ]:
        document.add_paragraph(item, style="List Bullet")

    document.add_page_break()


def add_creation_section(document: Document) -> None:
    add_heading(document, "Sentencias de Creación de Colecciones", level=1)
    add_body(document, "Sentencias ejecutadas en MongoDB Shell (mongosh):")
    add_code_block(
        document,
        """
use techstore_db
db.createCollection("clientes")
db.createCollection("empleados")
db.createCollection("proveedores")
db.createCollection("productos")
db.createCollection("ventas")
db.createCollection("detalle_venta")
db.createCollection("inventario")
show collections
        """,
    )

    add_capture_placeholder(
        document,
        "Captura 1 - Crear base de datos NoSQL",
        "Comando use techstore_db y confirmación de cambio de base de datos.",
    )
    add_capture_placeholder(
        document,
        "Captura 2 - Crear colecciones del proyecto",
        "Sentencias createCollection y resultado visible en Compass.",
    )

    document.add_page_break()


def add_inserts_section(document: Document) -> None:
    add_heading(document, "Sentencias de Inserción (JSON)", level=1)
    add_body(
        document,
        "A continuación se presentan inserciones en formato JSON para cada colección del proyecto TechStore."
    )

    inserts = {
        "clientes": """db.clientes.insertMany([...5 documentos...])""",
        "empleados": """db.empleados.insertMany([...5 documentos...])""",
        "proveedores": """db.proveedores.insertMany([...5 documentos...])""",
        "productos": """db.productos.insertMany([...5 documentos...])""",
        "ventas": """db.ventas.insertMany([...5 documentos...])""",
        "detalle_venta": """db.detalle_venta.insertMany([...5 documentos...])""",
        "inventario": """db.inventario.insertMany([...5 documentos...])""",
    }

    for collection_name, sentence in inserts.items():
        document.add_paragraph(f"Colección: {collection_name}", style="List Bullet")
        add_code_block(document, sentence)

    add_capture_placeholder(
        document,
        "Captura 3 - Inserción de documentos",
        "Resultados acknowledged e insertedIds de insertMany por colección.",
    )

    document.add_page_break()


def add_queries_and_updates_section(document: Document) -> None:
    add_heading(document, "Consultas", level=1)
    add_body(document, "Sentencias para listar cada colección completa:")
    add_code_block(
        document,
        """
db.clientes.find().sort({ id_cliente: 1 }).pretty()
db.empleados.find().sort({ id_empleado: 1 }).pretty()
db.proveedores.find().sort({ id_proveedor: 1 }).pretty()
db.productos.find().sort({ id_producto: 1 }).pretty()
db.ventas.find().sort({ id_venta: 1 }).pretty()
db.detalle_venta.find().sort({ id_detalle: 1 }).pretty()
db.inventario.find().sort({ id_inventario: 1 }).pretty()
        """,
    )
    add_capture_placeholder(
        document,
        "Captura 4 - Consulta de datos ingresados",
        "Salida de find() con los documentos insertados.",
    )

    add_heading(document, "Actualización de Datos (Primer y Último Registro)", level=1)
    add_body(document, "Sentencias de actualización ejecutadas:")
    add_code_block(
        document,
        """
db.clientes.updateOne({ id_cliente: "CLI001" }, { $set: { telefono: "3000001111" } })
db.clientes.updateOne({ id_cliente: "CLI005" }, { $set: { correo: "camila.perez@techstore.com" } })
db.empleados.updateOne({ id_empleado: "EMP001" }, { $set: { cargo: "Administrador General" } })
db.empleados.updateOne({ id_empleado: "EMP005" }, { $set: { usuario: "miguel.vendedor" } })
db.proveedores.updateOne({ id_proveedor: "PROV001" }, { $set: { correo: "canal.lenovo@techstore.com" } })
db.proveedores.updateOne({ id_proveedor: "PROV005" }, { $set: { correo: "alianzas.logitech@techstore.com" } })
db.productos.updateOne({ id_producto: "PRD001" }, { $set: { precio: 2350000, stock: 11 } })
db.productos.updateOne({ id_producto: "PRD005" }, { $set: { precio: 1820000, stock: 4 } })
db.ventas.updateOne({ id_venta: "VEN001" }, { $set: { estado: "entregado" } })
db.ventas.updateOne({ id_venta: "VEN005" }, { $set: { estado: "preparacion" } })
db.detalle_venta.updateOne({ id_detalle: "DET001" }, { $set: { cantidad: 2, subtotal: 4600000 } })
db.detalle_venta.updateOne({ id_detalle: "DET005" }, { $set: { cantidad: 1, subtotal: 1820000 } })
db.inventario.updateOne({ id_inventario: "INV001" }, { $set: { cantidad_actual: 11, fecha_actualizacion: new Date() } })
db.inventario.updateOne({ id_inventario: "INV005" }, { $set: { cantidad_actual: 4, fecha_actualizacion: new Date() } })
        """,
    )

    add_capture_placeholder(
        document,
        "Captura 5 - Actualizar primer y último registro",
        "Resultado matchedCount y modifiedCount de updateOne.",
    )
    add_capture_placeholder(
        document,
        "Captura 6 - Listado final actualizado",
        "Consulta final de las colecciones con cambios reflejados.",
    )

    document.add_page_break()


def add_conclusions(document: Document) -> None:
    add_heading(document, "Conclusiones", level=1)
    add_body(
        document,
        "Se implementó correctamente la base de datos NoSQL del proyecto TechStore, evidenciando la creación de "
        "colecciones, inserción de documentos, consultas y actualizaciones de registros. La práctica permitió "
        "relacionar el modelo de datos con los módulos funcionales de la interfaz y consolidar el uso de MongoDB "
        "como solución para persistencia de información en proyectos reales."
    )

    add_heading(document, "Anexos", level=1)
    add_body(
        document,
        "Anexar en esta sección capturas adicionales que respalden la ejecución completa en MongoDB Compass y MongoDB Shell."
    )
    add_capture_placeholder(
        document,
        "Captura 7 - Evidencia adicional",
        "Espacio opcional para soporte adicional solicitado por el instructor.",
    )


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    document = Document()
    set_page_margins(document)
    add_cover_page(document)
    add_intro_and_objectives(document)
    add_creation_section(document)
    add_inserts_section(document)
    add_queries_and_updates_section(document)
    add_conclusions(document)
    document.save(OUTPUT_FILE)
    print(str(OUTPUT_FILE))


if __name__ == "__main__":
    main()
